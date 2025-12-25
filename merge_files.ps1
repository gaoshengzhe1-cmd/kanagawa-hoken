# 合并 components 目录
if (Test-Path "temp_merge\components") {
    if (!(Test-Path "components")) {
        New-Item -ItemType Directory -Path "components" | Out-Null
    }
    Get-ChildItem -Path "temp_merge\components" | ForEach-Object {
        $destFile = Join-Path "components" $_.Name
        if (!(Test-Path $destFile)) {
            Move-Item -Path $_.FullName -Destination $destFile -Force
            Write-Host "Moved $($_.Name) to components/"
        } else {
            Write-Host "Skipped $($_.Name) - file already exists in components/"
        }
    }
}

# 合并 services 目录
if (Test-Path "temp_merge\services") {
    if (!(Test-Path "services")) {
        New-Item -ItemType Directory -Path "services" | Out-Null
    }
    Get-ChildItem -Path "temp_merge\services" | ForEach-Object {
        $destFile = Join-Path "services" $_.Name
        if (!(Test-Path $destFile)) {
            Move-Item -Path $_.FullName -Destination $destFile -Force
            Write-Host "Moved $($_.Name) to services/"
        } else {
            Write-Host "Skipped $($_.Name) - file already exists in services/"
        }
    }
}

# 合并 src 目录
if (Test-Path "temp_merge\src") {
    if (!(Test-Path "src")) {
        New-Item -ItemType Directory -Path "src" | Out-Null
    }
    Get-ChildItem -Path "temp_merge\src" -Recurse | Where-Object { !$_.PSIsContainer } | ForEach-Object {
        $relativePath = $_.FullName.Substring((Resolve-Path "temp_merge\src").Path.Length + 1)
        $destPath = Join-Path "src" $relativePath
        $destDir = [System.IO.Path]::GetDirectoryName($destPath)
        
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        
        if (!(Test-Path $destPath)) {
            Move-Item -Path $_.FullName -Destination $destPath -Force
            Write-Host "Moved $relativePath to src/"
        } else {
            Write-Host "Skipped $relativePath - file already exists in src/"
        }
    }
}

# 合并 store 目录
if (Test-Path "temp_merge\store") {
    if (!(Test-Path "store")) {
        New-Item -ItemType Directory -Path "store" | Out-Null
    }
    Get-ChildItem -Path "temp_merge\store" | ForEach-Object {
        $destFile = Join-Path "store" $_.Name
        if (!(Test-Path $destFile)) {
            Move-Item -Path $_.FullName -Destination $destFile -Force
            Write-Host "Moved $($_.Name) to store/"
        } else {
            Write-Host "Skipped $($_.Name) - file already exists in store/"
        }
    }
}

# 合并根目录下的文件
$rootFiles = @("App.tsx", "index.html", "index.tsx", "types.ts", "vite.config.ts", "tsconfig.json")
foreach ($file in $rootFiles) {
    $sourceFile = Join-Path "temp_merge" $file
    if (Test-Path $sourceFile) {
        if (!(Test-Path $file)) {
            Move-Item -Path $sourceFile -Destination $file -Force
            Write-Host "Moved $file to root directory"
        } else {
            Write-Host "Skipped $file - file already exists in root directory"
        }
    }
}

# 清理临时目录
if (Test-Path "temp_merge") {
    Remove-Item -Path "temp_merge" -Recurse -Force
    Write-Host "Cleaned up temporary files"
}

Write-Host "\nMerge completed successfully!" -ForegroundColor Green
