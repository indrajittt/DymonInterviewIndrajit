import { Page, Locator } from '@playwright/test';

type AccountRowData = {
  name: string;
  type: string;
  balance: string;
};

export class Accounts {
  readonly page: Page;
  readonly accountBalanceCells: Locator;
  readonly addAccountButton: Locator;
  readonly accountsTable: Locator;
  readonly addAccountDialog: Locator;
  readonly editAccountDialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountsTable = page.getByRole('table', { name: 'Accounts' });
    this.accountBalanceCells = this.accountsTable.locator('tbody tr td:nth-child(3)');
    this.addAccountButton = page.getByTestId('add-account-btn');
    this.addAccountDialog = page.getByTestId('add-account-dialog');
    this.editAccountDialog = page.getByTestId('edit-account-dialog');
  }

  async getAccountBalances(): Promise<string[]> {
    return this.accountBalanceCells.allTextContents();
  }

  getAccountRow(accountName: string): Locator {
    return this.accountsTable.locator('tbody tr').filter({ hasText: accountName });
  }

  async getAccountRowsByName(accountName: string): Promise<AccountRowData[]> {
    return this.getAccountRow(accountName).evaluateAll(rows => rows.map(row => {
      const cells = row.querySelectorAll('td');
      return {
        name: cells[0]?.querySelector('p')?.textContent?.trim() ?? '',
        type: cells[1]?.textContent?.trim() ?? '',
        balance: cells[2]?.textContent?.trim() ?? '',
      };
    }));
  }

  async createAccount(name: string, type: string, balance: string): Promise<void> {
    await this.addAccountButton.click();
    await this.addAccountDialog.getByTestId('account-form-name-input').fill(name);
    await this.addAccountDialog.getByTestId('account-form-type-select').click();
    await this.page.getByRole('option', { name: type, exact: true }).click();
    await this.addAccountDialog.locator('input[name="account_balance_field"]').fill(balance);
    await this.addAccountDialog.getByRole('checkbox', { name: 'I accept the terms and conditions' }).check();
    await this.addAccountDialog.getByTestId('save-account-form-btn').click();
  }

  async editAccountBalance(accountName: string, balance: string): Promise<void> {
    await this.getAccountRow(accountName).getByTestId('edit-account-btn').click();
    await this.editAccountDialog.locator('input[name="account_balance_field"]').fill(balance);
    await this.editAccountDialog.getByTestId('save-account-form-btn').click();
  }
}