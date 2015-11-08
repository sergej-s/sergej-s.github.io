/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var Cards = __webpack_require__(2);

	if (typeof jQuery !== 'undefined') {
	    (function ($) {
	        //Create jQuery plugin

	        var pluginName = "transformToCards",
	            defaults = {};

	        function Plugin(element, options) {
	            this.element = element;
	            this.settings = $.extend({}, defaults, options);
	            this._defaults = defaults;
	            this._name = pluginName;
	            this.init();
	        }

	        $.extend(Plugin.prototype, {
	            init: function init() {
	                var data = [];

	                //Interate over all li elements and populate data object with
	                //card's information
	                $(this.element).find('li').each(function (ind) {
	                    var card = $(this),
	                        $icon = $(card.find('img')[0]),
	                        $img = $(card.find('img')[1]);

	                    var cardData = {
	                        id: ind,
	                        icon: $icon.attr('src'),
	                        title: card.find('h1').text(),
	                        description: card.find('p').text(),
	                        width: 220,
	                        img: {
	                            src: $img.attr('src'),
	                            color: $img.attr('data-color'),
	                            height: Math.floor($img.height() / 2.0),
	                            width: Math.floor($img.width() / 2.0)
	                        }
	                    };
	                    data.push(cardData);
	                });

	                //Render react cards component with collected data and
	                //predetermined settings
	                this.component = React.render(React.createElement(Cards, { cardsData: data, settings: this.settings }), this.element);
	                return this;
	            }
	        });

	        $.fn[pluginName] = function (options) {
	            return this.map(function () {
	                if (!$.data(this, 'plugin_' + pluginName)) {
	                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
	                }
	                return $.data(this, 'plugin_' + pluginName);
	            });
	        };
	    })(jQuery);
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var Card = __webpack_require__(3);

	var Cards = React.createClass({
	    displayName: 'Cards',

	    propTypes: {
	        cardsData: React.PropTypes.array.isRequired,
	        settings: React.PropTypes.object.isRequired
	    },

	    //Obtain count of cards columns depending on window width
	    getColumnsCount: function getColumnsCount() {
	        var windowWidth = window.innerWidth,
	            widths = this.props.settings.widths;

	        if (windowWidth >= widths.bigScreen) {
	            return 4;
	        } else if (windowWidth < widths.bigScreen && windowWidth >= widths.middleScreen) {
	            return 2;
	        } else {
	            return 1;
	        }
	    },

	    //State is changed on window resize
	    getInitialState: function getInitialState() {
	        return { columnsCount: this.getColumnsCount() };
	    },

	    render: function render() {
	        var cardsData = this.props.cardsData,
	            cardsDataLength = cardsData.length,
	            cssClasses = this.props.settings.cssClasses;

	        function generateCardsList(cardsData) {
	            return React.createElement(
	                'ul',
	                { className: 'cards-column' },
	                cardsData.map(function (cardData) {
	                    return React.createElement(
	                        'li',
	                        null,
	                        React.createElement(Card, { key: cardData.id,
	                            data: cardData
	                        })
	                    );
	                })
	            );
	        }

	        //Split initial array of cards into columns depending on window size.
	        //It is necessary to keep first cards from array at a top of the columns.
	        switch (this.state.columnsCount) {
	            case 4:
	                var cardsColumns = [[], [], [], []],
	                    i = 0;

	                while (i < cardsDataLength) {
	                    cardsColumns[0].push(cardsData[i++]);
	                    i < cardsDataLength ? cardsColumns[1].push(cardsData[i++]) : null;
	                    i < cardsDataLength ? cardsColumns[2].push(cardsData[i++]) : null;
	                    i < cardsDataLength ? cardsColumns[3].push(cardsData[i++]) : null;
	                }
	                break;
	            case 2:
	                var cardsColumns = [[], []],
	                    i = 0;

	                while (i < cardsDataLength) {
	                    cardsColumns[0].push(cardsData[i++]);
	                    i < cardsDataLength ? cardsColumns[1].push(cardsData[i++]) : null;
	                }
	                break;
	            case 1:
	                var cardsColumns = [cardsData];
	                break;
	            default:

	        }

	        //Add css framework classes to handle columns styles
	        var cssColumnsClass = '';
	        switch (cardsColumns.length) {
	            case 4:
	                cssColumnsClass = cssClasses.bigScreen;
	                break;
	            case 2:
	                cssColumnsClass = cssClasses.middleScreen;
	                break;
	            default:
	        }

	        return React.createElement(
	            'div',
	            { className: cssClasses.container + ' cards' },
	            cardsColumns.map(function (cardsColumn) {
	                return React.createElement(
	                    'div',
	                    { className: cssColumnsClass },
	                    generateCardsList(cardsColumn)
	                );
	            })
	        );
	    },

	    //Change state (columns count) in accordance to window size
	    handleResize: function handleResize(e) {
	        var newColumnsCount = this.getColumnsCount();
	        if (this.state.columnsCount !== newColumnsCount) {
	            this.setState({ columnsCount: newColumnsCount });
	        }
	    },

	    componentDidMount: function componentDidMount() {
	        window.addEventListener('resize', this.handleResize);
	    },

	    componentWillUnmount: function componentWillUnmount() {
	        window.removeEventListener('resize', this.handleResize);
	    }
	});

	module.exports = Cards;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);

	var Card = React.createClass({
	    displayName: 'Card',

	    propTypes: {
	        data: React.PropTypes.object.isRequired,
	        mouseOverHandler: React.PropTypes.func.isRequired
	    },

	    getInitialState: function getInitialState() {
	        return { isOverlayed: false };
	    },

	    render: function render() {
	        var data = this.props.data,
	            cardStyle = {
	            background: 'url(' + data.img.src + ') no-repeat',
	            backgroundSize: data.width,
	            color: data.img.color,
	            height: data.img.height,
	            position: 'relative'
	        },
	            overlayStyle = {
	            height: data.img.height,
	            width: '100%',
	            top: 0,
	            position: 'absolute'
	        };

	        //Add overlay on mouse over
	        var overlay = '';
	        if (this.state.isOverlayed) {
	            overlay = React.createElement(
	                'div',
	                { style: overlayStyle,
	                    className: 'card-overlay',
	                    onMouseLeave: this.mouseLeaveHandler },
	                React.createElement(
	                    'ul',
	                    null,
	                    React.createElement(
	                        'li',
	                        null,
	                        React.createElement(
	                            'a',
	                            null,
	                            'Open'
	                        )
	                    ),
	                    React.createElement(
	                        'li',
	                        null,
	                        React.createElement(
	                            'a',
	                            null,
	                            'Print'
	                        )
	                    ),
	                    React.createElement(
	                        'li',
	                        null,
	                        React.createElement(
	                            'a',
	                            null,
	                            'Delete'
	                        )
	                    )
	                )
	            );
	        }

	        return React.createElement(
	            'div',
	            { style: cardStyle,
	                onMouseOver: this.mouseOverHandler,
	                onMouseLeave: this.mouseLeaveHandler },
	            React.createElement(
	                'div',
	                { className: 'card-caption' },
	                React.createElement('img', { src: data.icon }),
	                React.createElement(
	                    'h1',
	                    { className: 'card-header' },
	                    data.title
	                ),
	                React.createElement(
	                    'p',
	                    { className: 'card-description' },
	                    data.description
	                )
	            ),
	            overlay
	        );
	    },

	    mouseOverHandler: function mouseOverHandler(event) {
	        event.preventDefault();
	        if (this.state.isOverlayed === false) {
	            this.setState({ isOverlayed: true });
	        }
	    },

	    mouseLeaveHandler: function mouseLeaveHandler(event) {
	        event.preventDefault();
	        if (this.state.isOverlayed === true) {
	            this.setState({ isOverlayed: false });
	        }
	    }
	});

	module.exports = Card;

/***/ }
/******/ ]);