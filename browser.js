var h = require('hyperscript')
var newEvent = require('palmettoflow-event').newEvent

document.head.appendChild(
  h('link', { rel: 'stylesheet', href: 'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'})
)

document.body.appendChild(
  h('div.container-fluid', {
    'data-ng-controller': 'main'
  }, [
    h('.row', [
      h('.col-md-6', [
        h('h1', { style: { 'margin-bottom': '20px' }}, 'Results'),
        h('.well', [
          h('pre', '{{results}}')
        ])
      ]),
      h('.col-md-6', [
        h('h1', 'sandbox'),
        h('form', { 'data-ng-submit': 'submit()'}, [
          h('.form-group', [
            h('label.sr-only', 'Subject'),
            h('input.form-control', {
              'data-ng-model': 'event.subject',
              placeholder: 'Subject'
            })
          ]),
          h('.form-group', [
            h('label.sr-only', 'Action'),
            h('input.form-control', {
              'data-ng-model': 'event.action',
              placeholder: 'Action'
            })
          ]),
          h('.form-group', [
            h('label.sr-only', 'Object'),
            h('textarea.form-control', {
              'data-ng-model': 'event.object',
              placeholder: 'Object'
            })
          ]),
          h('.form-group', [
            h('label.sr-only', 'Actor'),
            h('textarea.form-control', {
              'data-ng-model': 'event.actor',
              placeholder: '[optional] actor'
            })
          ]),
          h('legend', 'Palmetto CouchDB Config'),
          h('.form-group', [
            h('label.sr-only', 'Palmetto Endpoint'),
            h('input.form-control', {
              'data-ng-model': 'palmetto.endpoint',
              placeholder: 'endpoint'
            })
          ]),
          h('.form-group', [
            h('label.sr-only', 'Palmetto App'),
            h('input.form-control', {
              'data-ng-model': 'palmetto.app',
              placeholder: 'app'
            })
          ]),
          h('button.btn.btn-primary', 'Submit')
        ]),
        h('button.btn.btn-warning', {
          style: { 'margin-top': '20px' },
          'data-ng-click': 'savePalmetto()'
        }, 'Save Palmetto Config Locally'),
        h('button.btn.btn-warning', {
          style: { 'margin-top': '20px', 'margin-left': '5px' },
          'data-ng-click': 'clearPalmetto()'
        }, 'Clear Palmetto Config Locally')
      ])
    ])
  ])
)


var angular = require('angular')

angular.module('app', [
  require('angular-storage')
])
  .controller('main', function ($scope, $http, store) {
    $scope.palmetto = store.get('palmetto')

    $scope.savePalmetto = function () {
      store.set('palmetto', $scope.palmetto)
    }

    $scope.clearPalmetto = function () {
      store.remove('palmetto', $scope.palmetto)
    }

    $scope.submit = function () {
      var ne = newEvent(
        $scope.event.subject,
        $scope.event.action,
        JSON.parse($scope.event.object),
        JSON.parse($scope.event.actor || "{}"))

      $http.post('/api', {
        newEvent: ne,
        palmetto: $scope.palmetto
      }).then(function (res) {
        $scope.results = JSON.stringify(res.data, undefined, 2)
      })
    }
  })

angular.element(document).ready(function() {
  angular.bootstrap(document, ['app'])
})