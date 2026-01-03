const production = 'production'
const development = 'development'

const mode = import.meta.env.MODE || development
let base_url = ''

if (mode === production) {
    base_url = import.meta.env.VITE_API_URL || "http://localhost:5000"
} else {
    base_url = 'http://localhost:5000'
}
export {base_url}