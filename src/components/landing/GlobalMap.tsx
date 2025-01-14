import React, { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Major trading hubs coordinates
const TRADING_HUBS = [
  { name: "New York", coordinates: [-74.006, 40.7128] },
  { name: "London", coordinates: [-0.1276, 51.5074] },
  { name: "Tokyo", coordinates: [139.6917, 35.6895] },
  { name: "Singapore", coordinates: [103.8198, 1.3521] },
  { name: "Sydney", coordinates: [151.2093, -33.8688] },
  { name: "Dubai", coordinates: [55.2708, 25.2048] },
  { name: "Hong Kong", coordinates: [114.1694, 22.3193] },
  { name: "Frankfurt", coordinates: [8.6821, 50.1109] },
  { name: "Toronto", coordinates: [-79.3832, 43.6532] },
  { name: "Mumbai", coordinates: [72.8777, 19.0760] }
];

export const GlobalMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      const token = import.meta.env.VITE_MAPBOX_TOKEN;
      if (!token) {
        console.warn('Mapbox token not found. Map will not be displayed.');
        return;
      }

      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        zoom: 1.5,
        center: [30, 15],
        pitch: 45,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Disable scroll zoom for smoother experience
      map.current.scrollZoom.disable();

      map.current.on('style.load', () => {
        if (!map.current) return;

        // Add atmosphere and fog effects
        map.current.setFog({
          color: 'rgb(23, 25, 29)',
          'high-color': 'rgb(36, 37, 42)',
          'horizon-blend': 0.4,
          'space-color': 'rgb(22, 24, 28)',
          'star-intensity': 0.6
        });

        // Add connection points
        TRADING_HUBS.forEach((hub, index) => {
          // Create a pulsing dot
          const size = 150;
          const pulsingDot = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),
            onAdd: function() {
              const canvas = document.createElement('canvas');
              canvas.width = this.width;
              canvas.height = this.height;
              this.context = canvas.getContext('2d');
            },
            render: function() {
              const duration = 2000;
              const t = (performance.now() % duration) / duration;
              const radius = (size / 2) * 0.3;
              const outerRadius = (size / 2) * 0.7 * t;
              const context = this.context;

              if (!context) return null;

              context.clearRect(0, 0, this.width, this.height);
              context.beginPath();
              context.arc(
                this.width / 2,
                this.height / 2,
                outerRadius,
                0,
                Math.PI * 2
              );
              context.fillStyle = `rgba(145, 115, 255, ${1 - t})`;
              context.fill();

              context.beginPath();
              context.arc(
                this.width / 2,
                this.height / 2,
                radius,
                0,
                Math.PI * 2
              );
              context.fillStyle = 'rgba(145, 115, 255, 1)';
              context.strokeStyle = 'white';
              context.lineWidth = 2 + 4 * (1 - t);
              context.fill();
              context.stroke();

              this.data = context.getImageData(
                0,
                0,
                this.width,
                this.height
              ).data;

              map.current?.triggerRepaint();
              return true;
            }
          };

          map.current.addImage(`pulsing-dot-${index}`, pulsingDot, { pixelRatio: 2 });

          // Add a layer showing the points
          map.current.addLayer({
            id: `point-${index}`,
            type: 'symbol',
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: hub.coordinates
                    },
                    properties: {
                      title: hub.name
                    }
                  }
                ]
              }
            },
            layout: {
              'icon-image': `pulsing-dot-${index}`,
              'icon-allow-overlap': true
            }
          });
        });

        // Add connecting lines
        const lineCoordinates = TRADING_HUBS.reduce((acc: number[][], hub, i) => {
          TRADING_HUBS.slice(i + 1).forEach(otherHub => {
            acc.push([
              ...hub.coordinates,
              ...otherHub.coordinates
            ]);
          });
          return acc;
        }, []);

        map.current.addLayer({
          id: 'connections',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'MultiLineString',
                coordinates: lineCoordinates
              }
            }
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#9173ff',
            'line-width': 1,
            'line-opacity': 0.5,
            'line-dasharray': [2, 2]
          }
        });
      });

      // Rotation animation
      const secondsPerRevolution = 240;
      const maxSpinZoom = 5;
      const slowSpinZoom = 3;
      let userInteracting = false;
      let spinEnabled = true;

      function spinGlobe() {
        if (!map.current) return;
        
        const zoom = map.current.getZoom();
        if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
          let distancePerSecond = 360 / secondsPerRevolution;
          if (zoom > slowSpinZoom) {
            const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
          }
          const center = map.current.getCenter();
          center.lng -= distancePerSecond;
          map.current.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      }

      // Event listeners
      map.current.on('mousedown', () => {
        userInteracting = true;
      });
      
      map.current.on('dragstart', () => {
        userInteracting = true;
      });
      
      map.current.on('mouseup', () => {
        userInteracting = false;
        spinGlobe();
      });
      
      map.current.on('touchend', () => {
        userInteracting = false;
        spinGlobe();
      });

      map.current.on('moveend', () => {
        spinGlobe();
      });

      spinGlobe();
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10" />
    </div>
  );
};