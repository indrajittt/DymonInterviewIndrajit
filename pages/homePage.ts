import {Page, Locator} from '@playwright/test'

export class HomePage {
    readonly page: Page
    readonly logOutButton: Locator
    readonly themeToggle: Locator
    readonly dashboardLink: Locator
    readonly accountsLink: Locator
    readonly transferLink: Locator


    constructor(page: Page) {
        this.page = page
        this.logOutButton = page.getByTestId('topbar-logout-btn')
        this.themeToggle = page.locator('button[title^="Switch to "]')
        this.dashboardLink = page.getByTestId('sidebar-link-dashboard')
        this.accountsLink = page.getByTestId('sidebar-link-accounts')
        this.transferLink = page.getByTestId('sidebar-link-transfer')
    }    

}