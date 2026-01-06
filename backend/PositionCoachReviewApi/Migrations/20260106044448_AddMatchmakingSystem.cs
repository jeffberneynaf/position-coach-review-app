using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PositionCoachReviewApi.Migrations
{
    /// <inheritdoc />
    public partial class AddMatchmakingSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AthleteProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    AthleteName = table.Column<string>(type: "TEXT", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Position = table.Column<string>(type: "TEXT", nullable: false),
                    SkillLevel = table.Column<string>(type: "TEXT", nullable: false),
                    ZipCode = table.Column<string>(type: "TEXT", nullable: false),
                    TrainingIntensity = table.Column<string>(type: "TEXT", nullable: false),
                    PreferredSchedule = table.Column<string>(type: "TEXT", nullable: false),
                    SessionsPerWeek = table.Column<int>(type: "INTEGER", nullable: false),
                    SessionDuration = table.Column<string>(type: "TEXT", nullable: false),
                    PreferredCoachingStyle = table.Column<string>(type: "TEXT", nullable: false),
                    PreferredCommunicationStyle = table.Column<string>(type: "TEXT", nullable: false),
                    PreferGroupTraining = table.Column<bool>(type: "INTEGER", nullable: false),
                    PreferOneOnOne = table.Column<bool>(type: "INTEGER", nullable: false),
                    PrimaryGoalsJson = table.Column<string>(type: "TEXT", nullable: false),
                    AreasForImprovementJson = table.Column<string>(type: "TEXT", nullable: false),
                    SpecialNeeds = table.Column<string>(type: "TEXT", nullable: false),
                    MaxBudgetPerSession = table.Column<decimal>(type: "TEXT", nullable: false),
                    MaxTravelDistanceMiles = table.Column<int>(type: "INTEGER", nullable: false),
                    WillingToTravel = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AthleteProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AthleteProfiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CoachMatchProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CoachId = table.Column<int>(type: "INTEGER", nullable: false),
                    CoachingStyle = table.Column<string>(type: "TEXT", nullable: false),
                    CommunicationStyle = table.Column<string>(type: "TEXT", nullable: false),
                    TrainingPhilosophy = table.Column<string>(type: "TEXT", nullable: false),
                    SpecialtiesJson = table.Column<string>(type: "TEXT", nullable: false),
                    PositionsCoached = table.Column<string>(type: "TEXT", nullable: false),
                    SkillLevelsAccepted = table.Column<string>(type: "TEXT", nullable: false),
                    AcceptsGroupTraining = table.Column<bool>(type: "INTEGER", nullable: false),
                    AcceptsOneOnOne = table.Column<bool>(type: "INTEGER", nullable: false),
                    AvailableDaysJson = table.Column<string>(type: "TEXT", nullable: false),
                    AvailableTimeSlotsJson = table.Column<string>(type: "TEXT", nullable: false),
                    MaxNewClientsPerMonth = table.Column<int>(type: "INTEGER", nullable: false),
                    SessionPriceMin = table.Column<decimal>(type: "TEXT", nullable: false),
                    SessionPriceMax = table.Column<decimal>(type: "TEXT", nullable: false),
                    TravelRadiusMiles = table.Column<int>(type: "INTEGER", nullable: false),
                    OffersVirtualSessions = table.Column<bool>(type: "INTEGER", nullable: false),
                    OffersInPersonSessions = table.Column<bool>(type: "INTEGER", nullable: false),
                    SuccessStoriesJson = table.Column<string>(type: "TEXT", nullable: false),
                    YearsCoachingPosition = table.Column<int>(type: "INTEGER", nullable: false),
                    CertificationsJson = table.Column<string>(type: "TEXT", nullable: false),
                    PreferredAthleteTraitsJson = table.Column<string>(type: "TEXT", nullable: false),
                    MinAgeAccepted = table.Column<int>(type: "INTEGER", nullable: false),
                    MaxAgeAccepted = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoachMatchProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoachMatchProfiles_Coaches_CoachId",
                        column: x => x.CoachId,
                        principalTable: "Coaches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MatchPreferences",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AthleteProfileId = table.Column<int>(type: "INTEGER", nullable: false),
                    PreferenceName = table.Column<string>(type: "TEXT", nullable: false),
                    FiltersJson = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchPreferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MatchPreferences_AthleteProfiles_AthleteProfileId",
                        column: x => x.AthleteProfileId,
                        principalTable: "AthleteProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MatchModels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AthleteProfileId = table.Column<int>(type: "INTEGER", nullable: false),
                    CoachMatchProfileId = table.Column<int>(type: "INTEGER", nullable: false),
                    MatchScore = table.Column<double>(type: "REAL", nullable: false),
                    MatchReasonsJson = table.Column<string>(type: "TEXT", nullable: false),
                    ScoreBreakdownJson = table.Column<string>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    AthleteInterestedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CoachInterestedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ConnectedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    AthleteNotes = table.Column<string>(type: "TEXT", nullable: false),
                    CoachNotes = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchModels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MatchModels_AthleteProfiles_AthleteProfileId",
                        column: x => x.AthleteProfileId,
                        principalTable: "AthleteProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MatchModels_CoachMatchProfiles_CoachMatchProfileId",
                        column: x => x.CoachMatchProfileId,
                        principalTable: "CoachMatchProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MatchInteractions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MatchId = table.Column<int>(type: "INTEGER", nullable: false),
                    ActorType = table.Column<string>(type: "TEXT", nullable: false),
                    ActorId = table.Column<int>(type: "INTEGER", nullable: false),
                    ActionType = table.Column<string>(type: "TEXT", nullable: false),
                    Message = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchInteractions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MatchInteractions_MatchModels_MatchId",
                        column: x => x.MatchId,
                        principalTable: "MatchModels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AthleteProfiles_Position",
                table: "AthleteProfiles",
                column: "Position");

            migrationBuilder.CreateIndex(
                name: "IX_AthleteProfiles_SkillLevel",
                table: "AthleteProfiles",
                column: "SkillLevel");

            migrationBuilder.CreateIndex(
                name: "IX_AthleteProfiles_UserId",
                table: "AthleteProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AthleteProfiles_ZipCode",
                table: "AthleteProfiles",
                column: "ZipCode");

            migrationBuilder.CreateIndex(
                name: "IX_CoachMatchProfiles_CoachId",
                table: "CoachMatchProfiles",
                column: "CoachId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CoachMatchProfiles_PositionsCoached",
                table: "CoachMatchProfiles",
                column: "PositionsCoached");

            migrationBuilder.CreateIndex(
                name: "IX_MatchInteractions_MatchId",
                table: "MatchInteractions",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchModels_AthleteProfileId",
                table: "MatchModels",
                column: "AthleteProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchModels_CoachMatchProfileId",
                table: "MatchModels",
                column: "CoachMatchProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchPreferences_AthleteProfileId",
                table: "MatchPreferences",
                column: "AthleteProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MatchInteractions");

            migrationBuilder.DropTable(
                name: "MatchPreferences");

            migrationBuilder.DropTable(
                name: "MatchModels");

            migrationBuilder.DropTable(
                name: "AthleteProfiles");

            migrationBuilder.DropTable(
                name: "CoachMatchProfiles");
        }
    }
}
