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
    console.log('Starting payment creation process...')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      console.error('User authentication error:', userError)
      throw new Error('Invalid user token')
    }

    console.log('User authenticated:', user.id)

    const { planId, amount, currency, interval } = await req.json() as CreatePaymentBody

    const xenditApiKey = Deno.env.get('XENDIT_SECRET_KEY')
    if (!xenditApiKey) {
      console.error('Xendit API key not configured')
      throw new Error('Xendit API key not configured')
    }

    console.log('Creating Xendit invoice for user:', user.id, 'with amount:', amount, currency)

    // Create Xendit invoice with proper Base64 encoding of API key
    try {
      const base64ApiKey = btoa(xenditApiKey + ':');
      console.log('Making request to Xendit API...');
      
      const response = await fetch('https://api.xendit.co/v2/invoices', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${base64ApiKey}`,
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

      const responseData = await response.json()
      console.log('Xendit API response:', responseData)

      if (!response.ok) {
        console.error('Xendit API error details:', {
          status: response.status,
          statusText: response.statusText,
          body: responseData
        })
        throw new Error(`Xendit API error: ${responseData.message || 'Unknown error'}`)
      }

      // Create payment record in database
      const { data: payment, error: paymentError } = await supabaseClient
        .from('payments')
        .insert({
          user_id: user.id,
          amount: amount,
          currency: currency,
          status: 'pending',
          xendit_payment_id: responseData.id,
          invoice_id: responseData.external_id,
          invoice_url: responseData.invoice_url,
          payment_method_info: {},
          metadata: {
            plan_id: planId,
            interval: interval,
          },
        })
        .select()
        .single()

      if (paymentError) {
        console.error('Payment record creation error:', paymentError)
        throw paymentError
      }

      console.log('Payment record created:', payment)
      console.log('Invoice URL:', responseData.invoice_url)

      return new Response(
        JSON.stringify({
          payment: payment,
          invoiceUrl: responseData.invoice_url,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    } catch (xenditError) {
      console.error('Xendit API call failed:', xenditError)
      throw xenditError
    }
  } catch (error) {
    console.error('Payment creation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})