-- Mark password reset migrations as applied
INSERT OR IGNORE INTO __EFMigrationsHistory (MigrationId, ProductVersion) 
VALUES ('20260211035315_AddPasswordReset', '10.0.1');

INSERT OR IGNORE INTO __EFMigrationsHistory (MigrationId, ProductVersion) 
VALUES ('20260211040423_AddPasswordResetFieldsToCoach', '10.0.1');
