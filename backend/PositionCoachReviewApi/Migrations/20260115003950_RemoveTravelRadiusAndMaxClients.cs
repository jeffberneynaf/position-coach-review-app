using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PositionCoachReviewApi.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTravelRadiusAndMaxClients : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxNewClientsPerMonth",
                table: "CoachMatchProfiles");

            migrationBuilder.DropColumn(
                name: "TravelRadiusMiles",
                table: "CoachMatchProfiles");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaxNewClientsPerMonth",
                table: "CoachMatchProfiles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TravelRadiusMiles",
                table: "CoachMatchProfiles",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
