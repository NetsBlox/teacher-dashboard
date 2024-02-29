<script lang="ts">
  import "../app.pcss";
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
  import { BottomNav, BottomNavItem, Tooltip } from 'flowbite-svelte';
  import { HomeSolid, UsersSolid, WalletSolid, UserCircleSolid, PlusSolid } from 'flowbite-svelte-icons';
</script>

<Navbar  >
    <NavBrand href="/">
    <img src="https://netsblox.org/images/full_logo.png" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
  </NavBrand>
    <NavHamburger  />
    <NavUl >
    <NavLi href="/">Home</NavLi>
    <NavLi href="https://login.netsblox.org">Login</NavLi>
  </NavUl>
</Navbar>

<slot></slot>

<BottomNav position="absolute" navType="application" classInner="grid-cols-5">
  <BottomNavItem btnName="Home" appBtnPosition="left">
    <HomeSolid class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" />
    <Tooltip arrow={false}>Home</Tooltip>
  </BottomNavItem>
  <BottomNavItem btnName="Wallet" appBtnPosition="middle">
    <WalletSolid class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" />
    <Tooltip arrow={false}>Wallet</Tooltip>
  </BottomNavItem>
  <div class="flex items-center justify-center">
    <BottomNavItem btnName="Create new item" appBtnPosition="middle" btnClass="inline-flex items-center justify-center w-10 h-10 font-medium bg-primary-600 rounded-full hover:bg-primary-700 group focus:ring-4 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-800">
      <PlusSolid class="text-white" />
      <Tooltip arrow={false}>Create new item</Tooltip>
    </BottomNavItem>
  </div>
  <BottomNavItem btnName="Settings" appBtnPosition="middle">
    <UsersSolid class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" />
    <Tooltip arrow={false}>Settings</Tooltip>
  </BottomNavItem>
  <BottomNavItem btnName="Profile" appBtnPosition="right">
    <UserCircleSolid class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" />
    <Tooltip arrow={false}>Profile</Tooltip>
  </BottomNavItem>
</BottomNav>
