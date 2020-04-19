import * as http from 'http'

export class RestClientService {
    public getUserTenants(): void {
        const options = {
            hostname: '127.0.0.1',
            port: 8080,
            path: '/api/user/1/tenants',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNDAzZWM3MGUwOTExYTc0MzUzNTc2OTA5YjNkNDYzMjI6MDQ1M2QwMzcxZjc4MGVlZjY5Yzg3ZTExYzU4NTRkNzAzYjUyZTE4Njk2MzIyMjY3NDNmZDNjODY0NjkyZDFhMyIsImlhdCI6MTU4NzM1NDU4MSwiZXhwIjoxNTg3NjEzNzgxfQ.tlCc0cnDDMCQz6R9Iwv3bK5cfJNS50nwHxQ56VIYQTc'
            }
        }
          
        const req = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
            
            res.on('data', d => {
                console.log('Get Love: ' + d)
            })
        })
        
        req.on('error', error => {
            console.error(error)
        })
        req.end()
    }
    public signIn(): void {
        const data = JSON.stringify({
            "username": "Hanor",
            "password": "LaLaLaLaLau"
        });
        const options = {
            hostname: '127.0.0.1',
            port: 8081,
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