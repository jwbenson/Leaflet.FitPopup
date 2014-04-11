L.FitPopup = L.Popup.extend({
	options: {
		fitBounds: true,
	},

	_initLayout: function () {
		var prefix = 'leaflet-popup',
			container = this._container = L.DomUtil.create('div',
			prefix + ' ' + (this.options.className || '') +
			' leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide'));

		this._topTipContainer = L.DomUtil.create('div', prefix + '-tip-container toptip', container);
		this._topTip = L.DomUtil.create('div', prefix + '-tip toptip', this._topTipContainer);

		if (this.options.closeButton) {
			var closeButton = this._closeButton = L.DomUtil.create('a', prefix + '-close-button', container);
			closeButton.href = '#close';
			closeButton.innerHTML = '&#215;';

			L.DomEvent
				.disableClickPropagation(closeButton)
				.on(closeButton, 'click', this._onCloseButtonClick, this);
		}

		var wrapper = this._wrapper = L.DomUtil.create('div', prefix + '-content-wrapper', container);
		this._contentNode = L.DomUtil.create('div', prefix + '-content', wrapper);

		L.DomEvent
			.disableClickPropagation(wrapper)
			.disableScrollPropagation(this._contentNode)
			.on(wrapper, 'contextmenu', L.DomEvent.stopPropagation);

		this._tipContainer = L.DomUtil.create('div', prefix + '-tip-container', container);
		this._tip = L.DomUtil.create('div', prefix + '-tip', this._tipContainer);
	},

	_updatePosition: function () {
		if (!this._map) { return; }

		var pos = this._map.latLngToLayerPoint(this._latlng),
		    offset = L.point(this.options.offset),
			containerHeight = this._container.offsetHeight,
		    containerWidth = this._containerWidth;

		if (this._zoomAnimated) {
			L.DomUtil.setPosition(this._container, pos);
		} else {
			offset = offset.add(pos);
		}

		var bottom = this._containerBottom = -offset.y,
		    left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;

		this._container.style.left = left + 'px';

		if (this.options.fitBounds) {
			var size = this._map.getSize();
			this._container.style.left = left + 'px';
			var tip = null
			var originalOffset = L.point(this.options.offset);
			//top or bottom positioning
			if( Math.abs(bottom) - containerHeight < 0){
				this._container.className = 'leaflet-popup leaflet-zoom-hide popup-bottom';
				this._container.style.bottom = 'auto';
				this._container.style.top = (offset.y - originalOffset.y) + 'px';
				tip = this._topTipContainer;
			}
			else {
				this._container.className = 'leaflet-popup leaflet-zoom-hide';
				// bottom position the popup in case the height of the popup changes (images loading etc)
				this._container.style.bottom = bottom + 'px';
				this._container.style.top = 'auto';
				tip = this._tipContainer;
			}

			//out of bounds left
			if (left < 0){
				this._container.style.left = 0 + 'px';
				tip.style.marginLeft = (offset.x - 20) + 'px';
				tip.style.marginRight = 'auto';
			}
			//out of bounds right
			else if (left + containerWidth > size.x) {
				this._container.style.left = (size.x - containerWidth) + 'px';
				tip.style.marginLeft = 'auto';
				tip.style.marginRight = (size.x - offset.x - 20) + 'px';
			}
			//within bounds
			else {
				tip.style.marginLeft = 'auto';
				tip.style.marginRight = 'auto';
			}
		}
		else {
			// bottom position the popup in case the height of the popup changes (images loading etc)
			this._container.style.left = left + 'px';
			this._container.style.bottom = bottom + 'px';
		}
	}
});
