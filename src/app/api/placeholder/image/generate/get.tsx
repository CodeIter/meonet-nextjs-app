
import { type NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'

export async function GET(request: NextRequest) {

  try {

    // Parse query parameters from the URL
    const { searchParams } = new URL(request.url)
    const width = parseInt(searchParams.get('width') || '400', 10)
    const height = parseInt(searchParams.get('height') || '300', 10)
    const size = parseInt(searchParams.get('size') || '40', 10)
    const bg = searchParams.get('bg') || '#ddd'
    const fg = searchParams.get('fg') || '#555'
    const text = searchParams.get('text') || `${width} x ${height}`

    // Validate width and height
    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      return NextResponse.json({
        error: 'Invalid width or height'
      }, { status: 400 })
    }

    // Generate the image using JSX and inline styles
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bg,
            color: fg,
            fontSize: size,
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            userSelect: 'none',
          }}
        >
          {text}
        </div>
      ),
      {
        width,
        height
      }
    )

  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json({
      error: 'Failed to generate image'
    }, { status: 500 })
  }

}

