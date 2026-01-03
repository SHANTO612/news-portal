const production = 'production'
const local = 'dev'

const mode = process.env.NODE_ENV || local

let base_api_url = ''

if (mode === production) {
    base_api_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
} else {
    base_api_url = 'http://localhost:5000'
}

export { base_api_url }