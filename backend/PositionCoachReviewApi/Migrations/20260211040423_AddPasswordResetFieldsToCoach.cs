using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PositionCoachReviewApi.Migrations
{
    /// <inheritdoc />
    public partial class AddPasswordResetFieldsToCoach : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PasswordResetToken",
                table: "Coaches",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PasswordResetTokenExpiry",
                table: "Coaches",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordResetToken",
                table: "Coaches");

            migrationBuilder.DropColumn(
                name: "PasswordResetTokenExpiry",
                table: "Coaches");
        }
    }
}
