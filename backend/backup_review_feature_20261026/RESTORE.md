# Instructions to Undo / Rollback Review Feature

If you ever want to undo the Review feature:

1. Rollback the database migration:
   ```bash
   cd backend
   php artisan migrate:rollback --step=1
   ```

2. Restore the original files from this backup:
   ```powershell
   Copy-Item -Force backend/backup_review_feature_20261026/api.php backend/routes/api.php
   Copy-Item -Force backend/backup_review_feature_20261026/Product.php backend/app/Models/Product.php
   Copy-Item -Force backend/backup_review_feature_20261026/ProductResource.php backend/app/Http/Resources/ProductResource.php
   Copy-Item -Force backend/backup_review_feature_20261026/DatabaseSeeder.php backend/database/seeders/DatabaseSeeder.php
   ```

3. Delete the newly created Review files:
   ```powershell
   Remove-Item backend/app/Models/Review.php
   Remove-Item backend/app/Http/Controllers/ReviewController.php
   Remove-Item backend/app/Http/Resources/ReviewResource.php
   Remove-Item -Recurse backend/app/Http/Requests/Review
   Remove-Item backend/database/seeders/ReviewSeeder.php
   Remove-Item backend/database/migrations/*_create_reviews_table.php
   ```

4. Delete this backup directory when finished:
   ```powershell
   Remove-Item -Recurse backend/backup_review_feature_20261026
   ```
