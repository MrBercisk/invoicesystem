<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Company;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class CompanyController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success(
            Company::latest()->get()
        );
    }

    public function store(StoreCompanyRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('signature')) {
            $data['signature'] = $this->storeImage(
                $request->file('signature'),
                'companies/signatures'
            );
        }

        if ($request->hasFile('stamp')) {
            $data['stamp'] = $this->storeImage(
                $request->file('stamp'),
                'companies/stamps'
            );
        }

        $company = Company::create($data);

        return ApiResponse::created($company);
    }

    public function show(Company $company): JsonResponse
    {
        return ApiResponse::success($company);
    }

    public function update(
        UpdateCompanyRequest $request,
        Company $company
    ): JsonResponse {
        $data = $request->validated();

        if ($request->hasFile('signature')) {
            $this->deleteImage($company->signature);

            $data['signature'] = $this->storeImage(
                $request->file('signature'),
                'companies/signatures'
            );
        }

        if ($request->hasFile('stamp')) {
            $this->deleteImage($company->stamp);

            $data['stamp'] = $this->storeImage(
                $request->file('stamp'),
                'companies/stamps'
            );
        }

        $company->update($data);

        return ApiResponse::success(
            $company->fresh()
        );
    }

    public function destroy(Company $company): JsonResponse
    {
        try {
            $this->deleteImage($company->signature);
            $this->deleteImage($company->stamp);

            $company->delete();

            return ApiResponse::message(
                'Perusahaan berhasil dihapus.'
            );
        } catch (QueryException $e) {
            return ApiResponse::error(
                'Perusahaan tidak bisa dihapus karena masih memiliki data terkait.'
            );
        }
    }

    /**
     * Compress and store image as WebP.
     */
    private function storeImage($file, string $directory): string
    {
        $filename = uniqid('', true) . '.webp';

        $path = $directory . '/' . $filename;

        $image = Image::read($file);

        // Resize jika terlalu besar.
        $image->scaleDown(width: 1600);

        // Encode ke WebP dengan quality 80.
        $encoded = $image->toWebp(80);

        Storage::disk('public')->put(
            $path,
            $encoded
        );

        return $path;
    }

    /**
     * Delete old image from storage.
     */
    private function deleteImage(?string $path): void
    {
        if (!$path) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}