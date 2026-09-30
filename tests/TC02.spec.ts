import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { HomePage } from '../pages/homePage';
import users from '../test-data/users.json';

test('dark mode remains enabled across sidebar pages', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  await loginPage.gotoLoginPage();
  await loginPage.login(users.standard_user.username, users.standard_user.password);
  await expect(page).toHaveURL('https://qaplayground.com/bank/dashboard');

  await homePage.themeToggle.click();
  await expect(homePage.themeToggle).toHaveAttribute('aria-label', 'Switch to light mode');

  const sidebarLinks = [
    homePage.dashboardLink,
    homePage.accountsLink,
    homePage.transferLink,
  ];

  for (const sidebarLink of sidebarLinks) {
    await sidebarLink.click();
    await expect(homePage.themeToggle).toHaveAttribute('aria-label', 'Switch to light mode');
  }
});