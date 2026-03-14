<?php

use App\Http\Controllers\Api\OpenAccountController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Customer\InvestmentController;
use Illuminate\Support\Facades\Route;

Route::post('/open-account', [OpenAccountController::class, 'store']);
Route::post('/login', [LoginController::class, 'store']);
Route::get('/admin/dashboard', [DashboardController::class, 'index']);
Route::get('/admin/customers', [DashboardController::class, 'customers']);
Route::post('/admin/customers', [DashboardController::class, 'storeCustomer']);
Route::put('/admin/customers/{user}', [DashboardController::class, 'updateCustomer']);
Route::patch('/admin/customers/{user}/role', [DashboardController::class, 'updateRole']);
Route::delete('/admin/customers/{user}', [DashboardController::class, 'destroy']);
Route::get('/admin/investments', [DashboardController::class, 'investments']);
Route::post('/admin/investments', [DashboardController::class, 'storeInvestment']);
Route::get('/customer/investments', [InvestmentController::class, 'index']);
