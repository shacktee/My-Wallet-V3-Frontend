angular
  .module('walletApp')
  .controller('WalletNavigationCtrl', WalletNavigationCtrl);

function WalletNavigationCtrl ($rootScope, $scope, Wallet, MyWallet, Options, Alerts, SecurityCenter, $state, $uibModal, filterFilter, $location) {
  $scope.status = Wallet.status;
  $scope.settings = Wallet.settings;
  $scope.security = SecurityCenter.security;

  let accountInfo = MyWallet.wallet && MyWallet.wallet.accountInfo;
  $scope.userHasAccount = () => MyWallet.wallet.external && MyWallet.wallet.external.coinify.hasAccount;
  $scope.isUserInvited = accountInfo && accountInfo.invited;

  $scope.isCountryWhitelisted = null;
  Options.get().then((options) => {
    $scope.isCountryWhitelisted = accountInfo && options.showBuySellTab.indexOf(accountInfo.countryCodeGuess) > -1;
  });

  // Debug:
  // $scope.isUserInvited = false;

  $scope.numberOfActiveLegacyAddresses = () => {
    if (!Wallet.status.isLoggedIn) return null;

    return filterFilter(Wallet.legacyAddresses(), {
      archived: false
    }).length;
  };

  $scope.numberOfActiveAccounts = () => {
    return filterFilter(Wallet.accounts(), {
      archived: false
    }).length;
  };

  $scope.accountsRoute = () => [
    'wallet.common.settings.accounts_index',
    'wallet.common.settings.accounts_addresses',
    'wallet.common.settings.imported_addresses'
  ].indexOf($state.current.name) > -1;

  $scope.showOrHide = (path) => $location.url().indexOf(path) !== -1;

  $rootScope.supportModal = () => $uibModal.open({
    templateUrl: 'partials/support.jade',
    windowClass: 'bc-modal auto'
  });

  $scope.signupForBuyAccess = () => {
    $uibModal.open({
      templateUrl: 'partials/buy-subscribe-modal.jade',
      controller: 'SubscribeCtrl',
      windowClass: 'bc-modal xs'
    });
  };
}
