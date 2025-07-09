using Microsoft.AspNetCore.Identity;
using TaskManager.API.Models;

namespace TaskManager.API.Data
{
    public class DbSeeder
    {
        public static async Task Seed(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();

            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            string email = "admin@taskmanager.com";
            string password = "password";

            var existingUser = await userManager.FindByEmailAsync(email);
            if (existingUser == null)
            {
                var newUser = new User
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(newUser, password);
                if (result.Succeeded)
                {
                    Console.WriteLine("✅ Admin user seeded successfully.");
                }
                else
                {
                    Console.WriteLine("❌ Failed to seed admin user: " + string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
        }
    }
}
