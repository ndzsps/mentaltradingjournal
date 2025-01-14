import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreatePaymentBody {
  planId: string;
  amount: number;
  currency: string;
  interval: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('Invalid user token')
    }

    const { planId, amount, currency, interval } = await req.json() as CreatePaymentBody

    const xenditApiKey = Deno.env.get('XENDIT_SECRET_KEY')
    if (!xenditApiKey) {
      throw new Error('Xendit API key not configured')
    }

    // Create Xendit invoice
    const response = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(xenditApiKey + ':')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_id: `plan_${planId}_${Date.now()}`,
        amount: amount,
        currency: currency,
        payment_methods: ['CREDIT_CARD', 'BCA', 'BNI', 'BSI', 'BRI', 'MANDIRI', 'PERMATA', 'ALFAMART', 'INDOMARET'],
        should_send_email: true,
        invoice_duration: 86400,
        customer: {
          email: user.email,
        },
        success_redirect_url: `${req.headers.get('origin')}/payment/success`,
        failure_redirect_url: `${req.headers.get('origin')}/payment/failed`,
      }),
    })

    const xenditInvoice = await response.json()

    // Create payment record in database
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        user_id: user.id,
        amount: amount,
        currency: currency,
        status: 'pending',
        xendit_payment_id: xenditInvoice.id,
        invoice_id: xenditInvoice.external_id,
        invoice_url: xenditInvoice.invoice_url,
        payment_method_info: {},
        metadata: {
          plan_id: planId,
          interval: interval,
        },
      })
      .select()
      .single()

    if (paymentError) {
      throw paymentError
    }

    return new Response(
      JSON.stringify({
        payment: payment,
        invoiceUrl: xenditInvoice.invoice_url,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})