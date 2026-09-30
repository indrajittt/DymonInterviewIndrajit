import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { HomePage} from '../pages/homePage';
import users from '../test-data/users.json'
import pageTitles from '../test-data/pageTitles.json'


test('login test', async ({ page }) => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  await loginPage.gotoLoginPage();
  await loginPage.login(users.standard_user.username, users.standard_user.password);

  await expect(page).toHaveURL("https://qaplayground.com/bank/dashboard");
  await expect(homePage.logOutButton).toBeVisible();

  const sidebarPages = [
    { link: homePage.dashboardLink, title: pageTitles.dashboard },
    { link: homePage.accountsLink, title: pageTitles.accounts },
    { link: homePage.transferLink, title: pageTitles.transfer },
  ];

  for (const sidebarPage of sidebarPages) {
    await sidebarPage.link.click();
    await expect(page.getByRole('heading', { name: sidebarPage.title, exact: true })).toBeVisible();
  }
});
