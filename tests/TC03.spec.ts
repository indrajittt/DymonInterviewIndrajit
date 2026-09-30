import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { HomePage } from '../pages/homePage';
import { Accounts } from '../pages/Accounts';
import users from '../test-data/users.json';

function parseCurrency(value: string) {
  const currencySign = value.replace(/[\d,.\s+-]/g, '');
  const numericValue = Number(value.replace(/[^\d.-]/g, ''));

  return {
    currencySign,
    amountInCents: Math.round(numericValue * 100),
  };
}

test('dashboard net worth matches the sum of account balances', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const accountsPage = new Accounts(page);

  await loginPage.gotoLoginPage();
  await loginPage.login(users.standard_user.username, users.standard_user.password);
  await expect(page).toHaveURL('https://qaplayground.com/bank/dashboard');

  const netWorthText = await homePage.totalNetWorth.textContent();
  expect(netWorthText).not.toBeNull();
  const netWorth = parseCurrency(netWorthText!);
  expect(netWorth.currencySign).not.toBe('');

  await homePage.accountsLink.click();
  const accountBalances = await accountsPage.getAccountBalances();
  expect(accountBalances.length).toBeGreaterThan(0);

  const parsedBalances = accountBalances.map(parseCurrency);
  for (const accountBalance of parsedBalances) {
    expect(accountBalance.currencySign).not.toBe('');
    expect(accountBalance.currencySign).toBe(netWorth.currencySign);
  }

  const totalAccountBalance = parsedBalances.reduce((total, balance) => total + balance.amountInCents, 0);
  expect(totalAccountBalance).toBe(netWorth.amountInCents);
});