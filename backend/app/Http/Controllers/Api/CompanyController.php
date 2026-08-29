<?php
namespace App\Http\Controllers\Api;
 
use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
 
class CompanyController extends Controller {
    public function index(): JsonResponse {
        return response()->json(Company::latest()->get());
    }
 
    public function store(Request $request): JsonResponse {
        $data = $request->validate([
            'name'                => 'required|string|max:255',
            'email'               => 'nullable|email',
            'phone'               => 'nullable|string',
            'address'             => 'nullable|string',
            'city'                => 'nullable|string',
            'state'               => 'nullable|string',
            'postal_code'         => 'nullable|string',
            'country'             => 'nullable|string',
            'npwp'                => 'nullable|string',
            'website'             => 'nullable|string',
            'bank_name'           => 'nullable|string',
            'bank_account_name'   => 'nullable|string',
            'bank_account_number' => 'nullable|string',
        ]);
        $company = Company::create($data);
        return response()->json($company, 201);
    }
 
    public function show(Company $company): JsonResponse {
        return response()->json($company);
    }
 
    public function update(Request $request, Company $company): JsonResponse {
        $data = $request->validate([
            'name'                => 'sometimes|required|string|max:255',
            'email'               => 'nullable|email',
            'phone'               => 'nullable|string',
            'address'             => 'nullable|string',
            'city'                => 'nullable|string',
            'state'               => 'nullable|string',
            'postal_code'         => 'nullable|string',
            'country'             => 'nullable|string',
            'npwp'                => 'nullable|string',
            'bank_name'           => 'nullable|string',
            'bank_account_name'   => 'nullable|string',
            'bank_account_number' => 'nullable|string',
        ]);
        $company->update($data);
        return response()->json($company);
    }
 
    public function destroy(Company $company): JsonResponse {
        $company->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
