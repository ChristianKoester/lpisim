import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

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
        label: 'Start',
        routerLink: 'home',
        icon: "pi pi-fw pi-home",
      },
      {
        label: 'Learn',
        icon: 'pi pi-fw pi-eye',
        items: [
          {
            label: 'LPIC 101',
            routerLink: 'learn/single/lpic101',
            icon: 'pi pi-fw pi-book',
          },
          {
            label: 'LPIC 102',
            routerLink: 'learn/single/lpic102',
            icon: 'pi pi-fw pi-book',
          },
          {
            separator: true
          },
          {
            label: 'LPIC 201',
            routerLink: 'learn/single/lpic201',
            icon: 'pi pi-fw pi-book',
          },
          {
            label: 'LPIC 202',
            routerLink: 'learn/single/lpic202',
            icon: 'pi pi-fw pi-book',
          },
        ]
      },
      {
        label: 'Check',
        icon: 'pi pi-fw pi-check-circle',
        items: [
          {
            label: 'LPIC 101',
            routerLink: 'check/lpic101',
            icon: 'pi pi-fw pi-book',
          },
          {
            label: 'LPIC 102',
            routerLink: 'check/lpic102',
            icon: 'pi pi-fw pi-book',
          },
          {
            separator: true
          },
          {
            label: 'LPIC 201',
            routerLink: 'check/lpic201',
            icon: 'pi pi-fw pi-book',
          },
          {
            label: 'LPIC 202',
            routerLink: 'check/lpic202',
            icon: 'pi pi-fw pi-book',
          },
        ]
      }, 
      {
        label: 'Exam',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'LPIC 101',
            routerLink: 'exam/lpic101',
            icon: 'pi pi-fw pi-book',
          },
          {
            label: 'LPIC 102',
            routerLink: 'exam/lpic102',
            icon: 'pi pi-fw pi-book',
          },
          {
            separator: true
          },
          {
            label: 'LPIC 201',
            routerLink: 'exam/lpic201',
            icon: 'pi pi-fw pi-book',
          },
          {
            label: 'LPIC 202',
            routerLink: 'exam/lpic202',
            icon: 'pi pi-fw pi-book',
          },
        ]
        
      },  
      {
        label: 'Fragenliste',
        icon: 'pi pi-fw pi-list',
        items: [
          {
            label: 'LPIC 101',
            routerLink: 'learn/list/lpic101',
            icon: 'pi pi-fw pi-book',
          },
          {
            label: 'LPIC 102',
            routerLink: 'learn/list/lpic102',
            icon: 'pi pi-fw pi-book',
          },
          {
            separator: true
          },
          {
            label: 'LPIC 201',
            routerLink: 'learn/list/lpic201',
            icon: 'pi pi-fw pi-book',
          },
          {
            label: 'LPIC 202',
            routerLink: 'learn/list/lpic202',
            icon: 'pi pi-fw pi-book',
          },
        ]
      },  
      {
        label: 'Einstellungen',
        routerLink: 'options',
        icon: 'pi pi-fw pi-cog',
      }
    ];
  }
}
