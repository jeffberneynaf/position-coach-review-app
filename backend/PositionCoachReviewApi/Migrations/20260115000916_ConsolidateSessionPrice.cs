using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PositionCoachReviewApi.Migrations
{
    /// <inheritdoc />
    public partial class ConsolidateSessionPrice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add new SessionPrice column
            migrationBuilder.AddColumn<decimal>(
                name: "SessionPrice",
                table: "CoachMatchProfiles",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            // Copy data from SessionPriceMin to SessionPrice
            migrationBuilder.Sql(
                "UPDATE CoachMatchProfiles SET SessionPrice = SessionPriceMin");

            // Drop the old columns
            migrationBuilder.DropColumn(
                name: "SessionPriceMin",
                table: "CoachMatchProfiles");

            migrationBuilder.DropColumn(
                name: "SessionPriceMax",
                table: "CoachMatchProfiles");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SessionPrice",
                table: "CoachMatchProfiles",
                newName: "SessionPriceMin");

            migrationBuilder.AddColumn<decimal>(
                name: "SessionPriceMax",
                table: "CoachMatchProfiles",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
