<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Company;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Format;
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

        if ($request->hasFile('logo')) {
            $data['logo'] = $this->storeImage(
                $request->file('logo'),
                'companies/logos'
            );
        }

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

        if ($request->hasFile('logo')) {
            $this->deleteImage($company->getRawOriginal('logo'));

            $data['logo'] = $this->storeImage(
                $request->file('logo'),
                'companies/logos'
            );
        }

        if ($request->hasFile('signature')) {
            $this->deleteImage($company->getRawOriginal('signature'));

            $data['signature'] = $this->storeImage(
                $request->file('signature'),
                'companies/signatures'
            );
        }

        if ($request->hasFile('stamp')) {
            $this->deleteImage($company->getRawOriginal('stamp'));

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
            $this->deleteImage(
                $company->getRawOriginal('logo')
            );

            $this->deleteImage(
                $company->getRawOriginal('signature')
            );

            $this->deleteImage(
                $company->getRawOriginal('stamp')
            );

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
    private function storeImage(
        UploadedFile $file,
        string $directory
    ): string {
        $filename = uniqid('', true) . '.webp';
        $path = $directory . '/' . $filename;

        $image = Image::decode($file);

        // Resize jika terlalu besar.
        $image->scaleDown(width: 1600);

        // Encode sebagai WebP dengan quality 80.
        $encoded = $image->encodeUsingFormat(
            Format::WEBP,
            quality: 80
        );

        Storage::disk('public')->put(
            $path,
            (string) $encoded
        );

        return $path;
    }

    /**
     * Delete image from storage.
     */
    private function deleteImage(?string $path): void
    {
        if (!$path) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}
