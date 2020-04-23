import * as http from 'http'

export class RestClientService {
    public getUserTenants(port: number): void {
        const options = {
            hostname: '127.0.0.1',
            port: port,
            path: '/api/user/1/tenants',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMjFlM2RhNTczM2EyZDFhMjk0Y2UxYzc3MTU0MTdmNzI6MmJhZjBmZTlkMDg1MTY3YjFkZGI1N2E5YTk1NDY4NmFiYTIxZmQ3MjkzY2IyMmY5YTVlMjllMWI5MjEzZGNjZiIsImlhdCI6MTU4NzQyMTM0MywiZXhwIjoxNTg3NjgwNTQzfQ.3MFHYAOml1rqIPJxXnNbHB2O-Y9oQ0fHQoelcLykKY4'
            }
        }
          
        const req = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
            
            res.on('data', d => {
                console.log('Tenants User: ' + d)
            })
        })
        
        req.on('error', error => {
            console.error(error)
        })
        req.end()
    }
    public signIn(port: number): void {
        const data = JSON.stringify({
            "username": "Hanor",
            "password": "LaLaLaLaLau"
        });
        const options = {
            hostname: '127.0.0.1',
            port: port,
            path: '/api/sign/in',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }
          
        const req = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
            
            res.on('data', d => {
                console.log('Login: ' + d)
            })
        })
        
        req.on('error', error => {
            console.error(error)
        })
        req.write(data)
        req.end()
    }
}