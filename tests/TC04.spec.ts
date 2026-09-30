import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { HomePage } from '../pages/homePage';
import { Accounts } from '../pages/Accounts';
import users from '../test-data/users.json';
import accountData from '../test-data/accounts.json';

function formatCurrency(amount: string): string {
  return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

test('create and edit an account without creating a duplicate row', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const accountsPage = new Accounts(page);
  const accountName = `${accountData.accountNamePrefix} ${Date.now()}`;

  await loginPage.gotoLoginPage();
  await loginPage.login(users.standard_user.username, users.standard_user.password);
  await expect(page).toHaveURL('https://qaplayground.com/bank/dashboard');
  await homePage.openAccounts();

  await accountsPage.createAccount(accountName, accountData.accountType, accountData.initialBalance);

  await expect.poll(() => accountsPage.getAccountRowsByName(accountName)).toEqual([{
    name: accountName,
    type: accountData.accountType,
    balance: formatCurrency(accountData.initialBalance),
  }]);

  await accountsPage.editAccountBalance(accountName, accountData.updatedBalance);

  await expect.poll(() => accountsPage.getAccountRowsByName(accountName)).toEqual([{
    name: accountName,
    type: accountData.accountType,
    balance: formatCurrency(accountData.updatedBalance),
  }]);
});