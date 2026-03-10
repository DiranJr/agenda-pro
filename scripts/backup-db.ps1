# Agenda Pro - Backup automático de banco de dados (SQLite)
# Fase 0/1 do Guia de Escalabilidade

$SourceFile = "prisma/dev.db"
$BackupFolder = "backups"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = "$BackupFolder/dev_backup_$Timestamp.db"

# Garantir que a pasta de backup existe
if (-not (Test-Path $BackupFolder)) {
    New-Item -ItemType Directory -Path $BackupFolder
}

# Realizar a cópia
if (Test-Path $SourceFile) {
    Copy-Item -Path $SourceFile -Destination $BackupFile
    Write-Host "✅ Backup concluído com sucesso: $BackupFile" -ForegroundColor Green
    
    # Limpeza: Manter apenas os últimos 7 backups
    $Backups = Get-ChildItem $BackupFolder | Sort-Object CreationTime -Descending
    if ($Backups.Count -gt 7) {
        $Backups[7..($Backups.Count-1)] | Remove-Item -Force
        Write-Host "🧹 Removidos backups antigos. Mantendo os 7 mais recentes." -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Erro: Arquivo de banco de dados não encontrado em $SourceFile" -ForegroundColor Red
}
