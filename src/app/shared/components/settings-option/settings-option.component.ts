import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export interface SettingsOption {
  title: string;
  titleUppercase?: boolean;
  desc: string;
  icon: string;
  iconColor: string;
  showChevron?: boolean;
  onClick: () => void;
}

@Component({
  selector: 'app-settings-option',
  imports: [MatIcon],
  templateUrl: './settings-option.component.html',
  styleUrl: './settings-option.component.scss',
})
export class SettingsOptionComponent {
  @Input() settingsOption: SettingsOption = {
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
    this.settingsOption.onClick();
  }
}
