import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'lpi-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: "pi pi-fw pi-home",
        routerLink: 'home'
      },
      {
        label: 'LPIC 101',
        icon: 'pi pi-fw pi-book',
        items: [
          {
            label: 'Learn',
            icon: 'pi pi-fw pi-eye',
            items: [
              {
                label: 'Liste',
                routerLink: 'learn/list/lpic101',
                icon: 'pi pi-fw pi-list',
              },
              {
                label: 'Einzelnd',
                routerLink: 'learn/single/lpic101',
                icon: 'pi pi-fw pi-eye',
              },
            ]
          },
          {
            label: 'Check',
            icon: 'pi pi-fw pi-check-circle',
          },
          {
            label: 'Exam',
            icon: 'pi pi-fw pi-pencil',
          },
        ],
      },
      {
        label: 'LPIC 102',
        icon: 'pi pi-fw pi-book',
        items: [
          {
            label: 'Learn',
            icon: 'pi pi-fw pi-eye',
            items: [
              {
                label: 'Liste',
                routerLink: 'learn/list/lpic102',
                icon: 'pi pi-fw pi-list',
              },
              {
                label: 'Einzelnd',
                routerLink: 'learn/single/lpic102',
                icon: 'pi pi-fw pi-eye',
              },
            ]
          },
          {
            label: 'Check',
            icon: 'pi pi-fw pi-check-circle',
          },
          {
            label: 'Exam',
            icon: 'pi pi-fw pi-pencil',
          },
        ],
      },
    ];
  }
}
