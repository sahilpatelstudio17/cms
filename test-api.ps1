# PowerShell test script for /auth/me endpoint

# $apiUrl = "http://localhost:8080/api"
$apiUrl = "https://cms-6eiy.onrender.com/api"

# Step 1: Login
Write-Host "1. Testing login..." -ForegroundColor Green
try {
    $loginBody = @{
        email = "company1@gmail.com"
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-WebRequest -Uri "$apiUrl/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -ErrorAction Stop

    Write-Host "✓ Login successful" -ForegroundColor Green
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.data.token
    Write-Host "Token: $($ token.Substring(0, 30))..." -ForegroundColor Cyan

    # Step 2: Test /auth/me
    Write-Host "`n2. Testing GET /auth/me..." -ForegroundColor Green
    $headers = @{ "Authorization" = "Bearer $token" }
    
    $meResponse = Invoke-WebRequest -Uri "$apiUrl/api/auth/me" `
        -Method GET `
        -Headers $headers `
        -ErrorAction Stop

    Write-Host "✓ GET /auth/me successful" -ForegroundColor Green
    $meData = $meResponse.Content | ConvertFrom-Json
    Write-Host "Response:" -ForegroundColor Cyan
    Write-Host ($meData.data | ConvertTo-Json -Depth 3) -ForegroundColor White

} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)"
        Write-Host "Response: $(([System.IO.StreamReader]$_.Exception.Response.GetResponseStream()).ReadToEnd())"
    }
}
