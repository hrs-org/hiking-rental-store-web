import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export interface SettingsOption {
  order: number;
  identifier: Identifier;
  section: Section;
  title: string;
  titleUppercase?: boolean;
  desc: string;
  icon: string;
  iconColor: string;
  showChevron?: boolean;
  onClick: () => void;
}

export enum Identifier {
  Profile = 'profile',
  ItemManagement = 'item-management',
  EmployeeManagement = 'employee-management',
  Logout = 'logout',
}

export enum Section {
  Account = 'Account',
  Management = 'Management',
  Settings = 'Settings',
}

@Component({
  selector: 'app-settings-option',
  imports: [MatIcon],
  templateUrl: './settings-option.component.html',
  styleUrl: './settings-option.component.scss',
})
export class SettingsOptionComponent {
  @Input() settingsOption: SettingsOption = {
    order: 0,
    identifier: Identifier.Profile,
    section: Section.Account,
    title: '',
    titleUppercase: false,
    desc: '',
    icon: '',
    iconColor: '',
    showChevron: false,
    onClick: () => {
      return;
    },
  };

  onItemClick() {
    console.log('Clicked', this.settingsOption);
    this.settingsOption.onClick();
  }
}
