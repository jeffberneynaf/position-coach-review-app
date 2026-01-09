using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PositionCoachReviewApi.Migrations
{
    /// <inheritdoc />
    public partial class AddCoachPhotoFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "PhotoUploadedAt",
                table: "Coaches",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhotoUrl",
                table: "Coaches",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ThumbnailUrl",
                table: "Coaches",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhotoUploadedAt",
                table: "Coaches");

            migrationBuilder.DropColumn(
                name: "PhotoUrl",
                table: "Coaches");

            migrationBuilder.DropColumn(
                name: "ThumbnailUrl",
                table: "Coaches");
        }
    }
}
