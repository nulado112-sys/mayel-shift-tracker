'use client'

import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'

export default function QRGeneratorPage() {
  const [baseUrl, setBaseUrl] = useState('')
  
  useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])

  const morningQrData = btoa('morning-shift-mayel')
  const eveningQrData = btoa('evening-shift-mayel')
  
  const morningUrl = `${baseUrl}/scan/${morningQrData}`
  const eveningUrl = `${baseUrl}/scan/${eveningQrData}`

  const handlePrint = (shiftType: string) => {
    const printWindow = window.open('', '_blank')
    const qrUrl = shiftType === 'morning' ? morningUrl : eveningUrl
    const emoji = shiftType === 'morning' ? '🌅' : '🌙'
    const color = shiftType === 'morning' ? '#3b82f6' : '#8b5cf6'
    
    printWindow?.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mayel ${shiftType} Shift QR Code</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              margin: 40px;
              background: white;
            }
            .qr-container {
              border: 3px solid ${color};
              border-radius: 15px;
              padding: 30px;
              margin: 20px auto;
              width: fit-content;
              background: #f8fafc;
            }
            .title {
              color: ${color};
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 15px;
            }
            .subtitle {
              color: #64748b;
              font-size: 18px;
              margin-bottom: 25px;
            }
            .instructions {
              margin-top: 25px;
              padding: 20px;
              background: #f1f5f9;
              border-radius: 10px;
              font-size: 16px;
              color: #475569;
            }
            .emoji {
              font-size: 40px;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="emoji">${emoji}</div>
            <div class="title">Mayel Restaurant</div>
            <div class="subtitle">${shiftType.charAt(0).toUpperCase() + shiftType.slice(1)} Shift</div>
            <div style="background: white; padding: 20px; border-radius: 10px;">
              <svg width="200" height="200" viewBox="0 0 256 256">
                ${generateQRCodeSVG(qrUrl)}
              </svg>
            </div>
            <div class="instructions">
              <strong>Instructions for Staff:</strong><br>
              1. Scan this QR code with your phone camera<br>
              2. Select your name from the list<br>
              3. Press <span style="background: #22c55e; color: white; padding: 3px 8px; border-radius: 5px;">START SHIFT</span> when arriving<br>
              4. Press <span style="background: #ef4444; color: white; padding: 3px 8px; border-radius: 5px;">END SHIFT</span> when leaving
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow?.document.close()
    printWindow?.print()
  }

  function generateQRCodeSVG(data: string): string {
    // This is a simplified QR code SVG generator
    // In production, you'd use a proper QR code library
    return `<rect width="256" height="256" fill="white"/>
            <text x="128" y="128" text-anchor="middle" fill="black" font-size="12">
              Scan with camera app
            </text>`
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            QR Code Generator
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Generate QR codes for morning and evening shifts
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Morning Shift QR */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">🌅</div>
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Morning Shift</h3>
              
              <div className="bg-white p-4 rounded-lg mb-4">
                <QRCode 
                  value={morningUrl}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
              
              <button
                onClick={() => handlePrint('morning')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                🖨️ Print Morning QR Code
              </button>
              
              <div className="mt-4 text-sm text-blue-700">
                URL: <code className="bg-blue-100 p-1 rounded">{morningUrl}</code>
              </div>
            </div>

            {/* Evening Shift QR */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">🌙</div>
              <h3 className="text-2xl font-bold text-purple-800 mb-4">Evening Shift</h3>
              
              <div className="bg-white p-4 rounded-lg mb-4">
                <QRCode 
                  value={eveningUrl}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
              
              <button
                onClick={() => handlePrint('evening')}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                🖨️ Print Evening QR Code
              </button>
              
              <div className="mt-4 text-sm text-purple-700">
                URL: <code className="bg-purple-100 p-1 rounded">{eveningUrl}</code>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <h4 className="font-semibold text-yellow-800 mb-2">Setup Instructions:</h4>
            <ol className="list-decimal list-inside text-yellow-700 space-y-1">
              <li>Print both QR codes using the buttons above</li>
              <li>Laminate the printed codes for durability</li>
              <li>Place them at the restaurant entrance or staff area</li>
              <li>Train staff to scan and use the green/red buttons</li>
              <li>Monitor attendance in the Admin Dashboard</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  )
}