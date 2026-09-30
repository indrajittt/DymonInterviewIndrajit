import { Page, Locator } from '@playwright/test';

export class Accounts {
  readonly page: Page;
  readonly accountBalanceCells: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountBalanceCells = page.getByRole('table', { name: 'Accounts' }).locator('tbody tr td:nth-child(3)');
  }

  async getAccountBalances(): Promise<string[]> {
    return this.accountBalanceCells.allTextContents();
  }
}