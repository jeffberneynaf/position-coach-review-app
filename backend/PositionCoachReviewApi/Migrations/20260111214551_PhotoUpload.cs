using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PositionCoachReviewApi.Migrations
{
    /// <inheritdoc />
    public partial class PhotoUpload : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfilePhotoUrl",
                table: "Coaches",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfilePhotoUrl",
                table: "Coaches");
        }
    }
}
