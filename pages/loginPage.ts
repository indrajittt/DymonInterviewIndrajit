import {Page, Locator} from '@playwright/test'

export class LoginPage {
    readonly page: Page
    readonly usernameTextbox: Locator
    readonly passwordTextbox: Locator
    readonly signInButton: Locator

    constructor(page: Page) {
        this.page = page
        this.usernameTextbox = page.getByTestId('login-username-input')
        this.passwordTextbox = page.getByTestId('login-password-input')
        this.signInButton = page.getByTestId('login-submit-btn')
    }

    async gotoLoginPage() {
        await this.page.goto('https://qaplayground.com/bank/login')
    }

    async login(username: string, password: string) {
        await this.usernameTextbox.fill(username)
        await this.passwordTextbox.fill(password)
        await this.signInButton.click()
    }

}