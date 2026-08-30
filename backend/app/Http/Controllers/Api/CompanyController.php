<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;

class CompanyController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success(Company::latest()->get());
    }

    public function store(StoreCompanyRequest $request): JsonResponse
    {
        $company = Company::create($request->validated());

        return ApiResponse::created($company);
    }

    public function show(Company $company): JsonResponse
    {
        return ApiResponse::success($company);
    }

    public function update(UpdateCompanyRequest $request, Company $company): JsonResponse
    {
        $company->update($request->validated());

        return ApiResponse::success($company);
    }

    public function destroy(Company $company): JsonResponse
    {
        try {
            $company->delete();

            return ApiResponse::message('Deleted successfully');
        } catch (QueryException $e) {
            return ApiResponse::error('Perusahaan tidak bisa dihapus karena masih memiliki data terkait.');
        }
    }
}