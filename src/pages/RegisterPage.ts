import { Page } from '@playwright/test';

export class RegisterPage {
  constructor(private page: Page) {}

  async registerUser(data: { firstName: string; lastName: string; address: string; city: string; state: string; zip: string; phone: string; ssn: string; username: string; password: string }) {
    await this.page.fill('[name="customer.firstName"]', data.firstName);
    await this.page.fill('[name="customer.lastName"]', data.lastName);
    await this.page.fill('[name="customer.address.street"]', data.address);
    await this.page.fill('[name="customer.address.city"]', data.city);
    await this.page.fill('[name="customer.address.state"]', data.state);
    await this.page.fill('[name="customer.address.zipCode"]', data.zip);
    await this.page.fill('[name="customer.phoneNumber"]', data.phone);
    await this.page.fill('[name="customer.ssn"]', data.ssn);
    await this.page.fill('[name="customer.username"]', data.username);
    await this.page.fill('[name="customer.password"]', data.password);
    await this.page.fill('[name="repeatedPassword"]', data.password);
    await this.page.getByRole('button', { name: 'Register' }).click();
  }
}