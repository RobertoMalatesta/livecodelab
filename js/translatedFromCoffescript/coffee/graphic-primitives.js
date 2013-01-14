"use strict";

var GraphicsCommands;

GraphicsCommands = (function() {

  GraphicsCommands.prototype.primitiveTypes = {};

  GraphicsCommands.prototype.minimumBallDetail = 2;

  GraphicsCommands.prototype.maximumBallDetail = 30;

  GraphicsCommands.prototype.doFill = true;

  GraphicsCommands.prototype.doStroke = true;

  GraphicsCommands.prototype.reflectValue = 1;

  GraphicsCommands.prototype.refractValue = 0.98;

  GraphicsCommands.prototype.currentStrokeAlpha = void 0;

  GraphicsCommands.prototype.currentStrokeColor = void 0;

  GraphicsCommands.prototype.geometriesBank = [];

  GraphicsCommands.prototype.SPIN_DURATION_IN_FRAMES = 30;

  GraphicsCommands.prototype.currentFillAlpha = void 0;

  GraphicsCommands.prototype.currentFillColor = void 0;

  GraphicsCommands.prototype.objectPools = [];

  GraphicsCommands.prototype.ballDetLevel = 8;

  GraphicsCommands.prototype.currentStrokeSize = 1;

  GraphicsCommands.prototype.objectsUsedInFrameCounts = [];

  GraphicsCommands.prototype.doTheSpinThingy = true;

  GraphicsCommands.prototype.resetTheSpinThingy = false;

  GraphicsCommands.prototype.defaultNormalFill = true;

  GraphicsCommands.prototype.defaultNormalStroke = true;

  function GraphicsCommands(liveCodeLabCore_THREE, liveCodeLabCoreInstance) {
    var i,
      _this = this;
    this.liveCodeLabCore_THREE = liveCodeLabCore_THREE;
    this.liveCodeLabCoreInstance = liveCodeLabCoreInstance;
    window.line = function(a, b, c) {
      return _this.line(a, b, c);
    };
    window.rect = function(a, b, c) {
      return _this.rect(a, b, c);
    };
    window.box = function(a, b, c) {
      return _this.box(a, b, c);
    };
    window.peg = function(a, b, c) {
      return _this.peg(a, b, c);
    };
    window.ball = function(a, b, c) {
      return _this.ball(a, b, c);
    };
    window.ballDetail = function(a) {
      return _this.ballDetail(a);
    };
    window.fill = function(a, b, c, d) {
      return _this.fill(a, b, c, d);
    };
    window.noFill = function() {
      return _this.noFill();
    };
    window.stroke = function(a, b, c, d) {
      return _this.stroke(a, b, c, d);
    };
    window.noStroke = function() {
      return _this.noStroke();
    };
    window.strokeSize = function(a) {
      return _this.strokeSize(a);
    };
    this.primitiveTypes.ambientLight = 0;
    this.primitiveTypes.line = 1;
    this.primitiveTypes.rect = 2;
    this.primitiveTypes.box = 3;
    this.primitiveTypes.peg = 4;
    this.primitiveTypes.ball = 5;
    this.objectPools[this.primitiveTypes.line] = [];
    this.objectPools[this.primitiveTypes.rect] = [];
    this.objectPools[this.primitiveTypes.box] = [];
    this.objectPools[this.primitiveTypes.peg] = [];
    i = 0;
    while (i < (this.maximumBallDetail - this.minimumBallDetail + 1)) {
      this.objectPools[this.primitiveTypes.ball + i] = [];
      i += 1;
    }
    this.geometriesBank[this.primitiveTypes.line] = new this.liveCodeLabCore_THREE.Geometry();
    this.geometriesBank[this.primitiveTypes.line].vertices.push(new this.liveCodeLabCore_THREE.Vector3(0, -0.5, 0));
    this.geometriesBank[this.primitiveTypes.line].vertices.push(new this.liveCodeLabCore_THREE.Vector3(0, 0.5, 0));
    this.geometriesBank[this.primitiveTypes.rect] = new this.liveCodeLabCore_THREE.PlaneGeometry(1, 1);
    this.geometriesBank[this.primitiveTypes.box] = new this.liveCodeLabCore_THREE.CubeGeometry(1, 1, 1);
    this.geometriesBank[this.primitiveTypes.peg] = new this.liveCodeLabCore_THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    i = 0;
    while (i < (this.maximumBallDetail - this.minimumBallDetail + 1)) {
      this.geometriesBank[this.primitiveTypes.ball + i] = new this.liveCodeLabCore_THREE.SphereGeometry(1, this.minimumBallDetail + i, this.minimumBallDetail + i);
      i += 1;
    }
  }

  GraphicsCommands.prototype.createObjectIfNeededAndDressWithCorrectMaterial = function(a, b, c, primitiveProperties, strokeTime, colorToBeUsed, alphaToBeUsed, applyDefaultNormalColor) {
    var objectIsNew, objectPool, pooledObjectWithMaterials, primitiveID, theAngle;
    objectIsNew = false;
    pooledObjectWithMaterials = void 0;
    theAngle = void 0;
    primitiveID = primitiveProperties.primitiveType + primitiveProperties.detailLevel;
    objectPool = this.objectPools[primitiveID];
    pooledObjectWithMaterials = objectPool[this.objectsUsedInFrameCounts[primitiveID]];
    if (pooledObjectWithMaterials === undefined) {
      pooledObjectWithMaterials = {
        lineMaterial: undefined,
        basicMaterial: undefined,
        lambertMaterial: undefined,
        normalMaterial: undefined,
        threejsObject3D: new primitiveProperties.THREEObjectConstructor(this.geometriesBank[primitiveID]),
        initialSpinCountdown: this.SPIN_DURATION_IN_FRAMES
      };
      objectIsNew = true;
      objectPool.push(pooledObjectWithMaterials);
    }
    if (primitiveProperties.primitiveType === this.primitiveTypes.line) {
      if (pooledObjectWithMaterials.lineMaterial === undefined) {
        pooledObjectWithMaterials.lineMaterial = new this.liveCodeLabCore_THREE.LineBasicMaterial();
      }
      if (this.currentStrokeColor === angleColor || this.defaultNormalStroke) {
        theAngle = pooledObjectWithMaterials.threejsObject3D.matrix.multiplyVector3(new this.liveCodeLabCore_THREE.Vector3(0, 1, 0)).normalize();
        pooledObjectWithMaterials.lineMaterial.color.setHex(color(((theAngle.x + 1) / 2) * 255, ((theAngle.y + 1) / 2) * 255, ((theAngle.z + 1) / 2) * 255));
      } else {
        pooledObjectWithMaterials.lineMaterial.color.setHex(this.currentStrokeColor);
      }
      pooledObjectWithMaterials.lineMaterial.linewidth = this.currentStrokeSize;
      pooledObjectWithMaterials.threejsObject3D.material = pooledObjectWithMaterials.lineMaterial;
    } else if (objectIsNew || (colorToBeUsed === angleColor || applyDefaultNormalColor)) {
      if (pooledObjectWithMaterials.normalMaterial === undefined) {
        pooledObjectWithMaterials.normalMaterial = new this.liveCodeLabCore_THREE.MeshNormalMaterial();
      }
      pooledObjectWithMaterials.threejsObject3D.material = pooledObjectWithMaterials.normalMaterial;
    } else if (!this.liveCodeLabCoreInstance.LightSystem.lightsAreOn) {
      if (pooledObjectWithMaterials.basicMaterial === undefined) {
        pooledObjectWithMaterials.basicMaterial = new this.liveCodeLabCore_THREE.MeshBasicMaterial();
      }
      pooledObjectWithMaterials.basicMaterial.color.setHex(colorToBeUsed);
      pooledObjectWithMaterials.threejsObject3D.material = pooledObjectWithMaterials.basicMaterial;
    } else {
      if (pooledObjectWithMaterials.lambertMaterial === undefined) {
        pooledObjectWithMaterials.lambertMaterial = new this.liveCodeLabCore_THREE.MeshLambertMaterial();
      }
      pooledObjectWithMaterials.lambertMaterial.color.setHex(colorToBeUsed);
      pooledObjectWithMaterials.threejsObject3D.material = pooledObjectWithMaterials.lambertMaterial;
    }
    pooledObjectWithMaterials.threejsObject3D.material.side = primitiveProperties.sidedness;
    pooledObjectWithMaterials.threejsObject3D.material.opacity = alphaToBeUsed;
    if (alphaToBeUsed < 1) {
      pooledObjectWithMaterials.threejsObject3D.material.transparent = true;
    }
    pooledObjectWithMaterials.threejsObject3D.material.wireframe = strokeTime;
    pooledObjectWithMaterials.threejsObject3D.material.wireframeLinewidth = this.currentStrokeSize;
    pooledObjectWithMaterials.threejsObject3D.material.reflectivity = this.reflectValue;
    pooledObjectWithMaterials.threejsObject3D.material.refractionRatio = this.refractValue;
    if (this.resetTheSpinThingy) {
      pooledObjectWithMaterials.initialSpinCountdown = this.SPIN_DURATION_IN_FRAMES;
      this.resetTheSpinThingy = false;
      this.doTheSpinThingy = true;
    }
    if (this.doTheSpinThingy) {
      pooledObjectWithMaterials.initialSpinCountdown -= 1;
    }
    if (pooledObjectWithMaterials.initialSpinCountdown === -1) {
      this.doTheSpinThingy = false;
    }
    pooledObjectWithMaterials.threejsObject3D.primitiveType = primitiveProperties.primitiveType;
    pooledObjectWithMaterials.threejsObject3D.detailLevel = primitiveProperties.detailLevel;
    this.objectsUsedInFrameCounts[primitiveID] += 1;
    if (this.doTheSpinThingy && pooledObjectWithMaterials.initialSpinCountdown > 0) {
      this.liveCodeLabCoreInstance.MatrixCommands.pushMatrix();
      this.liveCodeLabCoreInstance.MatrixCommands.rotate(pooledObjectWithMaterials.initialSpinCountdown / 50);
    }
    pooledObjectWithMaterials.threejsObject3D.matrixAutoUpdate = false;
    pooledObjectWithMaterials.threejsObject3D.matrix.copy(this.liveCodeLabCoreInstance.MatrixCommands.getWorldMatrix());
    pooledObjectWithMaterials.threejsObject3D.matrixWorldNeedsUpdate = true;
    if (this.doTheSpinThingy && pooledObjectWithMaterials.initialSpinCountdown > 0) {
      this.liveCodeLabCoreInstance.MatrixCommands.popMatrix();
    }
    if (objectIsNew) {
      pooledObjectWithMaterials.threejsObject3D.matrix.scale(new this.liveCodeLabCore_THREE.Vector3(0.0001, 0.0001, 0.0001));
    } else if (a !== 1 || b !== 1 || c !== 1) {
      if (strokeTime) {
        pooledObjectWithMaterials.threejsObject3D.matrix.scale(new this.liveCodeLabCore_THREE.Vector3(a + 0.001, b + 0.001, c + 0.001));
      } else {
        pooledObjectWithMaterials.threejsObject3D.matrix.scale(new this.liveCodeLabCore_THREE.Vector3(a, b, c));
      }
    }
    if (objectIsNew) {
      return this.liveCodeLabCoreInstance.ThreeJsSystem.scene.add(pooledObjectWithMaterials.threejsObject3D);
    }
  };

  GraphicsCommands.prototype.commonPrimitiveDrawingLogic = function(a, b, c, primitiveProperties) {
    if (a === undefined) {
      a = 1;
      b = 1;
      c = 1;
    } else if (b === undefined) {
      b = a;
      c = a;
    } else {
      if (c === undefined) {
        c = 1;
      }
    }
    if (!this.doStroke && (!this.doFill || !primitiveProperties.canFill)) {
      return;
    }
    if ((primitiveProperties.canFill && this.doFill && (this.currentStrokeSize === 0 || !this.doStroke || (this.currentStrokeSize <= 1 && !this.defaultNormalFill && !this.defaultNormalStroke && this.currentStrokeColor === this.currentFillColor && this.currentFillAlpha === 1 && this.currentStrokeAlpha === 1))) || (this.currentStrokeSize <= 1 && this.defaultNormalFill && this.defaultNormalStroke)) {
      return this.createObjectIfNeededAndDressWithCorrectMaterial(a, b, c, primitiveProperties, false, this.currentFillColor, this.currentFillAlpha, this.defaultNormalFill);
    } else if ((!this.doFill || !primitiveProperties.canFill) && this.doStroke) {
      return this.createObjectIfNeededAndDressWithCorrectMaterial(a, b, c, primitiveProperties, true, this.currentStrokeColor, this.currentStrokeAlpha, this.defaultNormalStroke);
    } else {
      this.createObjectIfNeededAndDressWithCorrectMaterial(a, b, c, primitiveProperties, true, this.currentStrokeColor, this.currentStrokeAlpha, this.defaultNormalStroke);
      return this.createObjectIfNeededAndDressWithCorrectMaterial(a, b, c, primitiveProperties, false, this.currentFillColor, this.currentFillAlpha, this.defaultNormalFill);
    }
  };

  GraphicsCommands.prototype.reset = function() {
    var i, _results;
    this.fill(0xFFFFFFFF);
    this.stroke(0xFFFFFFFF);
    this.currentStrokeSize = 1;
    this.defaultNormalFill = true;
    this.defaultNormalStroke = true;
    this.ballDetLevel = this.liveCodeLabCoreInstance.ThreeJsSystem.ballDefaultDetLevel;
    this.objectsUsedInFrameCounts[this.primitiveTypes.ambientLight] = 0;
    this.objectsUsedInFrameCounts[this.primitiveTypes.line] = 0;
    this.objectsUsedInFrameCounts[this.primitiveTypes.rect] = 0;
    this.objectsUsedInFrameCounts[this.primitiveTypes.box] = 0;
    this.objectsUsedInFrameCounts[this.primitiveTypes.peg] = 0;
    i = void 0;
    i = 0;
    _results = [];
    while (i < (this.maximumBallDetail - this.minimumBallDetail + 1)) {
      this.objectsUsedInFrameCounts[this.primitiveTypes.ball + i] = 0;
      _results.push(i += 1);
    }
    return _results;
  };

  GraphicsCommands.prototype.line = function(a, b, c) {
    var primitiveProperties, rememberIfThereWasAFill, rememberPreviousStrokeSize;
    if (this.liveCodeLabCoreInstance.LightSystem.lightsAreOn) {
      rememberIfThereWasAFill = this.doFill;
      rememberPreviousStrokeSize = this.currentStrokeSize;
      if (this.currentStrokeSize < 2) {
        this.currentStrokeSize = 2;
      }
      if (a === undefined) {
        a = 1;
      }
      this.rect(0, a, 0);
      this.doFill = rememberIfThereWasAFill;
      this.currentStrokeSize = rememberPreviousStrokeSize;
      return;
    }
    primitiveProperties = {
      canFill: false,
      primitiveType: this.primitiveTypes.line,
      sidedness: this.liveCodeLabCore_THREE.FrontSide,
      THREEObjectConstructor: this.liveCodeLabCore_THREE.Line,
      detailLevel: 0
    };
    return this.commonPrimitiveDrawingLogic(a, b, c, primitiveProperties);
  };

  GraphicsCommands.prototype.rect = function(a, b, c) {
    var primitiveProperties;
    primitiveProperties = {
      canFill: true,
      primitiveType: this.primitiveTypes.rect,
      sidedness: this.liveCodeLabCore_THREE.DoubleSide,
      THREEObjectConstructor: this.liveCodeLabCore_THREE.Mesh,
      detailLevel: 0
    };
    return this.commonPrimitiveDrawingLogic(a, b, c, primitiveProperties);
  };

  GraphicsCommands.prototype.box = function(a, b, c) {
    var primitiveProperties;
    primitiveProperties = {
      canFill: true,
      primitiveType: this.primitiveTypes.box,
      sidedness: this.liveCodeLabCore_THREE.FrontSide,
      THREEObjectConstructor: this.liveCodeLabCore_THREE.Mesh,
      detailLevel: 0
    };
    return this.commonPrimitiveDrawingLogic(a, b, c, primitiveProperties);
  };

  GraphicsCommands.prototype.peg = function(a, b, c) {
    var primitiveProperties;
    primitiveProperties = {
      canFill: true,
      primitiveType: this.primitiveTypes.peg,
      sidedness: this.liveCodeLabCore_THREE.FrontSide,
      THREEObjectConstructor: this.liveCodeLabCore_THREE.Mesh,
      detailLevel: 0
    };
    return this.commonPrimitiveDrawingLogic(a, b, c, primitiveProperties);
  };

  GraphicsCommands.prototype.ballDetail = function(a) {
    if (a === undefined) {
      return;
    }
    if (a < 2) {
      a = 2;
    }
    if (a > 30) {
      a = 30;
    }
    return this.ballDetLevel = Math.round(a);
  };

  GraphicsCommands.prototype.ball = function(a, b, c) {
    var primitiveProperties;
    primitiveProperties = {
      canFill: true,
      primitiveType: this.primitiveTypes.ball,
      sidedness: this.liveCodeLabCore_THREE.FrontSide,
      THREEObjectConstructor: this.liveCodeLabCore_THREE.Mesh,
      detailLevel: this.ballDetLevel - this.minimumBallDetail
    };
    return this.commonPrimitiveDrawingLogic(a, b, c, primitiveProperties);
  };

  GraphicsCommands.prototype.fill = function(r, g, b, a) {
    this.doFill = true;
    if (r !== angleColor) {
      this.defaultNormalFill = false;
      this.currentFillColor = color(r, g, b);
      return this.currentFillAlpha = alphaZeroToOne(color(r, g, b, a));
    } else {
      this.defaultNormalFill = true;
      this.currentFillColor = angleColor;
      if (b === undefined && g !== undefined) {
        return this.currentFillAlpha = g / this.liveCodeLabCoreInstance.ColourFunctions.colorModeA;
      } else {
        return this.currentFillAlpha = 1;
      }
    }
  };

  /*
    The noFill() function disables filling geometry.
    If both <b>noStroke()</b> and <b>noFill()</b>
    are called, no shapes will be drawn to the screen.
    
    @see #fill()
  */


  GraphicsCommands.prototype.noFill = function() {
    this.doFill = false;
    return this.defaultNormalFill = false;
  };

  /*
    The stroke() function sets the color used to draw lines and borders around shapes.
    This color is either specified in terms of the RGB or HSB color depending on the
    current <b>colorMode()</b> (the default color space is RGB, with each
    value in the range from 0 to 255).
    <br><br>When using hexadecimal notation to specify a color, use "#" or
    "0x" before the values (e.g. #CCFFAA, 0xFFCCFFAA). The # syntax uses six
    digits to specify a color (the way colors are specified in HTML and CSS).
    When using the hexadecimal notation starting with "0x", the hexadecimal
    value must be specified with eight characters; the first two characters
    define the alpha component and the remainder the red, green, and blue
    components.
    <br><br>The value for the parameter "gray" must be less than or equal
    to the current maximum value as specified by <b>colorMode()</b>.
    The default maximum value is 255.
    
    @param {int|float} gray    number specifying value between white and black
    @param {int|float} value1  red or hue value
    @param {int|float} value2  green or saturation value
    @param {int|float} value3  blue or brightness value
    @param {int|float} alpha   opacity of the stroke
    @param {Color} color       any value of the color datatype
    @param {int} hex           color value in hex notation (i.e. #FFCC00 or 0xFFFFCC00)
    
    @see #fill()
    @see #noStroke()
    @see #tint()
    @see #background()
    @see #colorMode()
  */


  GraphicsCommands.prototype.stroke = function(r, g, b, a) {
    this.doStroke = true;
    if (r !== angleColor) {
      this.defaultNormalStroke = false;
      this.currentStrokeColor = color(r, g, b);
      return this.currentStrokeAlpha = alphaZeroToOne(color(r, g, b, a));
    } else {
      this.defaultNormalStroke = true;
      this.currentStrokeColor = angleColor;
      if (b === undefined && g !== undefined) {
        return this.currentStrokeAlpha = g / this.liveCodeLabCoreInstance.ColourFunctions.colorModeA;
      } else {
        return this.currentStrokeAlpha = 1;
      }
    }
  };

  /*
    The noStroke() function disables drawing the stroke (outline).
    If both <b>noStroke()</b> and <b>noFill()</b> are called, no shapes
    will be drawn to the screen.
    
    @see #stroke()
  */


  GraphicsCommands.prototype.noStroke = function() {
    return this.doStroke = false;
  };

  GraphicsCommands.prototype.strokeSize = function(a) {
    if (a === undefined) {
      a = 1;
    } else {
      if (a < 0) {
        a = 0;
      }
    }
    return this.currentStrokeSize = a;
  };

  return GraphicsCommands;

})();
