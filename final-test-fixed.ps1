# final-test-fixed.ps1 - Complete System Test
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "COMPLETE FLIGHT BOOKING SYSTEM TEST" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Flight Service (Student A)
Write-Host "STEP 1: Flight Service" -ForegroundColor Yellow
try {
    $flights = Invoke-RestMethod -Uri "http://localhost:5001/api/flights/" -UseBasicParsing
    $flight = $flights.data[0]
    Write-Host "   OK: Flight $($flight.flightNumber) - $($flight.origin) to $($flight.destination) - `$$($flight.price)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: Flight Service not available" -ForegroundColor Red
}
Write-Host ""

# Test 2: User Service (Student D)
Write-Host "STEP 2: User Service" -ForegroundColor Yellow
try {
    $timestamp = Get-Date -Format "yyyyMMddHHmmss"
    $userBody = @{
        email = "john.doe$timestamp@example.com"
        password = "password123"
        firstName = "John"
        lastName = "Doe"
        phone = "+1234567890"
    } | ConvertTo-Json

    $user = Invoke-RestMethod -Uri "http://localhost:5004/api/users/register" -Method Post -Body $userBody -ContentType "application/json" -UseBasicParsing
    $userId = $user.user.id
    Write-Host "   OK: User registered with ID: $userId" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: User Service not available" -ForegroundColor Red
}
Write-Host ""

# Test 3: Booking Service (Student B)
Write-Host "STEP 3: Booking Service" -ForegroundColor Yellow
if ($userId -and $flight) {
    try {
        $bookingBody = @{
            userId = $userId
            flightId = $flight.id
            seatNumber = "12A"
            passengerName = "John Doe"
            passengerEmail = "john.doe@example.com"
        } | ConvertTo-Json

        $booking = Invoke-RestMethod -Uri "http://localhost:5002/api/bookings" -Method Post -Body $bookingBody -ContentType "application/json" -UseBasicParsing
        $bookingRef = $booking.data.booking.reference
        Write-Host "   OK: Booking created: $bookingRef" -ForegroundColor Green
    } catch {
        Write-Host "   ERROR: Booking Service failed" -ForegroundColor Red
    }
} else {
    Write-Host "   SKIP: Missing user or flight data" -ForegroundColor Yellow
}
Write-Host ""

# Test 4: Payment Service (Student C)
Write-Host "STEP 4: Payment Service" -ForegroundColor Yellow
if ($bookingRef -and $flight) {
    try {
        $paymentBody = @{
            booking_reference = $bookingRef
            user_id = $userId
            amount = $flight.price
            payment_method = "credit_card"
        } | ConvertTo-Json

        $payment = Invoke-RestMethod -Uri "http://localhost:5003/api/payments/" -Method Post -Body $paymentBody -ContentType "application/json" -UseBasicParsing
        Write-Host "   OK: Payment processed successfully" -ForegroundColor Green
    } catch {
        Write-Host "   ERROR: Payment Service failed" -ForegroundColor Red
    }
} else {
    Write-Host "   SKIP: Missing booking reference" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "ALL SYSTEMS TEST COMPLETE" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Cyan