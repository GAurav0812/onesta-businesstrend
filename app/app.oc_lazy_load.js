/* ocLazyLoad config */

ableApp
    .config([
        '$ocLazyLoadProvider',
        function($ocLazyLoadProvider) {
            $ocLazyLoadProvider.config({
                debug: false,
                events: false,
                 cache: true,
                loadedModules: ['base64', 'ngCookies', 'ui.router', 'oc.lazyLoad','ui.bootstrap', 'ui.slimscroll', 'angularRipple'],
                modules: 
                [
                    // ----------- FORM ELEMENTS -----------
                    {
                        name: 'lazy_ace-editor',
                        files: [                            
                            'bower_components/ace-builds/src/ace.js',
                            'bower_components/angular-ui-ace/ui-ace.js',
                            'bower_components/ace-builds/src-min-noconflict/ext-language_tools.js',
                            'bower_components/ace-builds/src-min-noconflict/snippets/text.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_animation',
                        files: [
                            'bower_components/animate.css/animate.css',
                            'bower_components/angular-animate/angular-animate.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_button_fab',
                        files: [
                            'bower_components/jquery-fab/dist/css/jquery-fab.css'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_c3_chart',
                        files: [
                            'bower_components/c3/c3.css',
                            'bower_components/d3/d3.min.js',
                            'bower_components/c3/c3.min.js',
                            'bower_components/c3-angular/c3-angular.js',
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_chartjs',
                        files: [
                            'bower_components/chartist/dist/chartist.css',
                            'bower_components/chart.js/dist/Chart.js',
                            'bower_components/angular-chart.js/angular-chart.js',
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_ck-editor',
                        files: [
                            'bower_components/ckeditor/ckeditor.js',
                            'bower_components/ng-ckeditor/ng-ckeditor.js',
                            'bower_components/ng-ckeditor/ng-ckeditor.css'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_compose',
                        files: [
                            'bower_components/angular-summernote/dist/angular-summernote.js',
                            'bower_components/summernote/dist/summernote.js',
                            'bower_components/summernote/dist/summernote.css'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_crm_contact',
                        files: [
                            'bower_components/ng-dialog/css/ngDialog.min.css',
                            'bower_components/ng-dialog/css/ngDialog-theme-default.min.css',
                            'bower_components/ng-dialog/js/ngDialog.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_counter',
                        files: [
                            'bower_components/angular-count-to/build/angular-count-to.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_timer',
                        files: [
                            'bower_components/angular-ui-clock/dist/angular-clock.js',
                            'bower_components/angular-ui-clock/dist/angular-clock.css',
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_dashboard',
                        files: [
                            'bower_components/jquery-sparkline/dist/jquery.sparkline.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_dashboard2',
                        files: [
                            'bower_components/highcharts/highcharts.js',
                            'bower_components/jquery-sparkline/dist/jquery.sparkline.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_data_table',
                        files: [
                            'bower_components/datatables.net/js/jquery.dataTables.min.js',
                            'bower_components/datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css',
                            'bower_components/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
                            'assets/plugins/data-table/css/buttons.dataTables.min.css',
                            'bower_components/angular-datatables/demo/src/archives/dist/angular-datatables.js',
                            'bower_components/angular-datatables/demo/src/archives/dist/css/angular-datatables.css',
                            'bower_components/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
                            'bower_components/datatables.net-responsive/js/dataTables.responsive.min.js',
                            'bower_components/datatables.net-buttons/js/dataTables.buttons.min.js',
                            'bower_components/angular-datatables/demo/src/archives/dist/plugins/bootstrap/angular-datatables.bootstrap.js',
                            'bower_components/datatables.net-buttons/js/buttons.colVis.js',
                            'bower_components/datatables.net-buttons/js/buttons.flash.js',
                            'bower_components/datatables.net-buttons/js/buttons.print.min.js',
                            'bower_components/datatables.net-buttons/js/buttons.html5.min.js',
                            'bower_components/angular-datatables/demo/src/archives/dist/plugins/buttons/angular-datatables.buttons.js',
                            'assets/plugins/data-table/js/jszip.min.js',
                            'assets/plugins/data-table/js/pdfmake.min.js',
                            'assets/plugins/data-table/js/vfs_fonts.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_draggable',
                        files: [
                            'bower_components/angular-ui-sortable/Sortable.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_dynamic_grid',
                        files: [
                            ''
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_echart',
                        files: [
                            'assets/plugins/charts/echarts/js/echarts-all.js',
                            'bower_components/angular-echarts/dist/angular-echarts.js',
                            'bower_components/angular-echarts/src/directive.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_ediatble_table',
                        files: [
                            'bower_components/angular-xeditable/dist/js/xeditable.min.js',
                            'bower_components/angular-xeditable/dist/css/xeditable.min.css',
                            'assets/modules/editable-table-module.js',
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_file_upload',
                        files: [
                            'bower_components/dropzone/dist/dropzone.css',
                            'bower_components/dropzone/dist/dropzone.js',
                            'bower_components/ng-dropzone/dist/ng-dropzone.js',
                            'bower_components/ng-dropzone/dist/ng-dropzone.min.css',
                            'assets/modules/file-upload-module.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_flag',
                        files: [
                            'assets/icon/flag-icons/css/flag-icon.css'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_float_chart',
                        files: [
                            'bower_components/chartist/dist/chartist.css',
                            'bower_components/flot/jquery.flot.js',
                            'bower_components/flot/jquery.flot.categories.js',
                            'bower_components/flot/jquery.flot.pie.js',
                            'bower_components/angular-flot/angular-flot.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_foo_tables',
                        files: [
                            'assets/plugins/foo-table/css/jquery.dataTables.min.css',
                            'bower_components/footable/dist/footable.min.js',
                            'bower_components/angular-footable/dist/angular-footable.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_form_elements_advance',
                        files: [
                            'bower_components/switchery/dist/switchery.min.css',
                            'bower_components/switchery/dist/switchery.min.js',
                            'bower_components/ng-switchery/src/ng-switchery.js',
                            'bower_components/select2/dist/css/select2.min.css',
                            'assets/plugins/select2/js/select.js',
                            'assets/plugins/select2/css/select.css',
                            'bower_components/bootstrap-material-datetimepicker/css/bootstrap-material-datetimepicker.css',
                            'bower_components/bootstrap-daterangepicker/daterangepicker.css',        
                            'bower_components/bootstrap-multiselect/dist/css/bootstrap-multiselect.css',
                            'bower_components/isteven-angular-multiselect/isteven-multi-select.css',
                            'assets/plugins/multi-select/css/multi-select.css',
                            'bower_components/spectrum/spectrum.css',
                            'bower_components/ng-tags-input/ng-tags-input.bootstrap.css',
                            'bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',                            
                            'bower_components/angular-sanitize/angular-sanitize.js',
                            'bower_components/isteven-angular-multiselect/isteven-multi-select.js',
                            'assets/plugins/multi-select/js/multi-select.js',
                            'bower_components/ng-tags-input/ng-tags-input.min.js',
                            'bower_components/angular-daterangepicker/js/angular-daterangepicker.js',
                            'assets/plugins/datepicker/js/moment-with-locales.min.js',
                            'assets/plugins/datepicker/js/datetimepicker.js',
                            'assets/plugins/datepicker/js/datetimepicker.templates.js',
                            'assets/plugins/datepicker/css/datetimepicker.css',
                            'assets/plugins/datepicker/js/bootstrap-material-datetimepicker.js',
                            'bower_components/bootstrap-daterangepicker/daterangepicker.js',
                            'bower_components/spectrum/spectrum.js',
                            'bower_components/bootstrap-daterangepicker/daterangepicker.css',
                            'bower_components/angular-spectrum-colorpicker/dist/angular-spectrum-colorpicker.js',
                            'assets/plugins/color-picker/js/color-picker.js',
                            'assets/plugins/color-picker/css/color-picker.css',
                            'bower_components/jscolor/jscolor.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_form_mask',
                        files: [
                            'bower_components/angular-input-masks/angular-input-masks-standalone.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_forms_wizard',
                        files: [                            
                            'bower_components/angular-multi-step-form/dist/browser/angular-multi-step-form.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_full_calender',
                        files: [
                            'bower_components/moment/moment.js',
                            'bower_components/angular-ui-calendar/src/calendar.js',
                            'bower_components/fullcalendar/dist/fullcalendar.min.css',
                            'bower_components/fullcalendar/dist/fullcalendar.min.js',
                            'bower_components/fullcalendar/dist/gcal.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_gallery',
                        files: [
                            'assets/plugins/gallery/css/lightgallery.css',
                            'bower_components/lightgallery/dist/js/lightgallery.js'

                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_gridstack',
                        files: [
                            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.3/highlight.min.js',
                            'bower_components/lodash/lodash.js',
                            'assets/plugins/gridstack/js/gridstack.js',
                            'assets/plugins/gridstack/js/gridstack.jQueryUI.js',
                            'assets/css/gridstack.min.css',
                            'bower_components/gridstack-angular/src/gridstack.controller.js',
                            'bower_components/gridstack-angular/src/gridstack.directive.js',
                            'bower_components/gridstack-angular/src/gridstackitem.directive.js',
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_ico_icon',
                        files: [
                            'assets/icon/ion-icon/css/ionicons.min.css'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_knob_chart',
                        files: [
                            'bower_components/chartist/dist/chartist.css',
                            'bower_components/ng-knob/dist/ng-knob.js',
                            'bower_components/d3/d3.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_light_box',
                        files: [
                            'bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.css',
                            'bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_list',
                        files: [
                            'assets/plugins/list-scroll/css/list.css',
                            'bower_components/stroll/css/stroll.css',                            
                             'bower_components/animate.css/animate.css'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_map_google',
                        files: [
                            'bower_components/angular-simple-logger/dist/angular-simple-logger.js',
                            'bower_components/angular-google-maps/dist/angular-google-maps.js'
                            
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_map_vector',
                        files: [
                            'assets/plugins/map-vector/css/jquery-jvectormap-2.0.2.css',
                            'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js',
                            'assets/plugins/map-vector/js/jquery-jvectormap-2.0.2.min.js',
                            'assets/plugins/map-vector/js/jquery-jvectormap-world-mill-en.js',
                            'assets/plugins/map-vector/js/jquery-jvectormap-us-aea-en.js',
                            'assets/plugins/map-vector/js/jquery-jvectormap-uk-mill-en.js',
                            'assets/plugins/map-vector/js/jquery-jvectormap-au-mill.js',
                            'assets/plugins/map-vector/js/jquery-jvectormap-us-il-chicago-mill-en.js',
                            'assets/plugins/map-vector/js/jquery-jvectormap-ca-lcc.js',
                            'assets/plugins/map-vector/js/jquery-jvectormap-de-mill.js',
                            'assets/plugins/map-vector/js/jquery-jvectormap-in-mill.js',
                            'assets/plugins/map-vector/js/jquery-jvectormap-asia-mill.js'

                            
                        ],
                        serie: true
                    },
                     {
                        name: 'lazy_menu_bottom',
                        files: [
                            'assets/css/menu-bottom.css'                           
                        ],
                        serie: true
                    },
                     {
                        name: 'lazy_menu_footer_fixed',
                        files: [
                            'assets/js/menu-footer-fixed.js'                           
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_modal',
                        files: [
                            'bower_components/sweetalert/dist/sweetalert.css',
                            'bower_components/sweetalert/dist/sweetalert.min.js',
                            'bower_components/ngSweetAlert/SweetAlert.js',
                            'bower_components/ng-mk-modal-effect/dist/mkModal.js',
                            'bower_components/ng-mk-modal-effect/dist/mkModal.css',
                            'assets/plugins/modal/css/component.css'                           
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_morris_chart',
                        files: [
                            'bower_components/chartist/dist/chartist.css',
                            'bower_components/raphael/raphael.min.js',
                            'bower_components/angular-morris/build/module/angular-morris/angular-morris.min.js',
                            'bower_components/morris.js/morris.min.js'                            
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_nestable',
                        files: [
                            'assets/plugins/nestable/css/nestable.css',
                            'bower_components/Nestable/dist/js/jquery.nestable.js',
                            'bower_components/angular-nestable/src/angular-nestable.js'                          
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_notification',
                        files: [
                            'bower_components/angular-ui-notification/dist/angular-ui-notification.css',
                            'bower_components/angular-ui-notification/dist/angular-ui-notification.js',
                            'bower_components/angular-animate/angular-animate.js',
                            'bower_components/animate.css/animate.css'/*,
                            'assets/modules/notification-module.js'       */                    
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_nvd3_chart',
                        files: [
                            'bower_components/nvd3/build/nv.d3.css',
                            'bower_components/d3/d3.min.js',
                            'bower_components/nvd3/build/nv.d3.js',
                            'bower_components/angular-nvd3/dist/angular-nvd3.js'                         
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_peity_chart',
                        files: [
                             'bower_components/chartist/dist/chartist.css', 
                             'bower_components/peity/jquery.peity.js',                        
                             'assets/plugins/charts/peity/js/angular-peity.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_portlets',
                        files: [
                             'bower_components/isotope/jquery.isotope.min.js',
                             'assets/plugins/isotope/js/isotope.pkgd.min.js',
                             'bower_components/angular-isotope/dist/angular-isotope.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_pricing',
                        files: [
                             'assets/plugins/pricing/css/style.css',
                             'bower_components/modernizr/modernizr.js'                             
                        ],
                        serie: true
                    },
                     {
                        name: 'lazy_rating',
                        files: [
                             'assets/css/hover-min.css',
                             'bower_components/jquery-bar-rating/dist/themes/bootstrap-stars.css',
                             'bower_components/jquery-bar-rating/dist/themes/bars-1to10.css',
                             'bower_components/jquery-bar-rating/dist/themes/bars-horizontal.css',
                             'bower_components/jquery-bar-rating/dist/themes/bars-movie.css',
                             'bower_components/jquery-bar-rating/dist/themes/bars-pill.css',
                             'bower_components/jquery-bar-rating/dist/themes/bars-reversed.css',
                             'bower_components/jquery-bar-rating/dist/themes/bars-square.css',
                             'bower_components/jquery-bar-rating/dist/themes/css-stars.css',
                             'bower_components/jquery-bar-rating/dist/themes/fontawesome-stars.css',
                             'bower_components/jquery-bar-rating/dist/themes/fontawesome-stars-o.css',
                             'bower_components/jquery-bar-rating/jquery.barrating.js',
                             'bower_components/angular-bar-rating/dist/angular-bar-rating.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_product_detail',
                        files: [
                             'bower_components/slick-carousel/slick/slick.css',
                             'bower_components/slick-carousel/slick/slick-theme.css',
                             'bower_components/slick-carousel/slick/slick.js',
                             'bower_components/angular-slick/dist/slick.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_radial_chart',
                        files: [
                             'assets/plugins/radial/css/radial.css'
                        ],
                        serie: true
                    },
                     {
                        name: 'lazy_range-slider',
                        files: [
                             'bower_components/angularjs-slider/dist/rzslider.min.css',
                             'bower_components/angularjs-slider/dist/rzslider.min.js',
                             'bower_components/angularjs-slider/src/rzSliderTpl.html'
                        ],
                        serie: true
                    },
                     {
                        name: 'lazy_responsive_table',
                        files: [
                             'bower_components/angular-responsive-tables/release/angular-responsive-tables.min.css',
                             'bower_components/angular-responsive-tables/release/angular-responsive-tables.min.js'
                        ],
                        serie: true
                    },
                     {
                        name: 'lazy_rickshaw_chart',
                        files: [
                             'bower_components/chartist/dist/chartist.css',
                             'bower_components/d3/d3.min.js',
                             'bower_components/rickshaw/rickshaw.min.js',
                             'bower_components/angular-rickshaw/rickshaw.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_search_result2',
                        files: [
                             'bower_components/bootstrap-material-datetimepicker/css/bootstrap-material-datetimepicker.css',
                            'assets/plugins/datepicker/js/moment-with-locales.min.js',
                            'assets/plugins/datepicker/js/bootstrap-material-datetimepicker.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_slider',
                        files: [
                             'assets/css/carousel.css',
                             'assets/css/owl.carousel.css',
                             'bower_components/swiper/dist/css/swiper.min.css',
                             'assets/js/owl.carousel.min.js',
                             'bower_components/swiper/dist/js/swiper.min.js',
                             'bower_components/angular-swiper/dist/angular-swiper.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_sticky',
                        files: [
                             'bower_components/angular-markdown-editable/angular-markdown-editable.js',
                             'bower_components/showdown/src/showdown.js',
                             'assets/plugins/sticky/css/sticky-custom.css'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_timeline',
                        files: [
                             'assets/plugins/timeline/css/style.css'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_todo',
                        files: [
                             'assets/plugins/todo/js/todo.js'
                        ],
                        serie: true
                    },
                     {
                        name: 'lazy_treeview',
                        files: [
                             'bower_components/angular-animate/angular-animate.min.js',
                             'bower_components/angular-recursion/angular-recursion.min.js',
                             'bower_components/angular-tree-widget/dist/angular-tree-widget.min.js',
                             'bower_components/angular-tree-widget/dist/angular-tree-widget.min.css'
                        ],
                        serie: true
                    },
                     {
                        name: 'lazy_typicons_icons',
                        files: [
                             'assets/icon/typicons-icons/css/typicons.min.css'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_weather_icons',
                        files: [
                             'assets/icon/weather-icons/css/weather-icons.min.css',
                             'assets/icon/weather-icons/css/weather-icons-wind.min.css',
                             'assets/css/svg-weather.css'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_widget',
                        files: [
                             'assets/css/owl.carousel.css',
                             'assets/js/owl.carousel.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_wysiwyg_editor',
                        files: [
                             'bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
                             'bower_components/angular-wysiwyg/dist/angular-wysiwyg.min.js'
                        ],
                        serie: true
                    },
                    
                ]
            })
        }
    ]);