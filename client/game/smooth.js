import * as PIXI from 'pixi.js';

class Smooth {
  constructor(options = {
    engine: PIXI,
    renderer: undefined,
    root: undefined,
    update: undefined,
    interpolate: true,
    fps: 60,
    renderFps: undefined,
    properties: {
      position: true,
      rotation: true,
      size: false,
      scale: false,
      alpha: false,
      tile: false,
    },
  }) {
    if (options.engine === undefined) throw new Error("Please assign a rendering engine as Smoothie's engine option");

    this.engine = '';

    if (options.engine.particles.ParticleContainer && options.engine.Sprite) {
      this.renderingEngine = 'pixi';
      this.Container = options.engine.Container;
      this.Sprite = options.engine.Sprite;
      this.MovieClip = options.engine.extras.AnimatedSprite;
    }

    if (options.renderer === undefined) {
      throw new Error("Please assign a renderer object as Smoothie's renderer option");
    } else {
      this.renderer = options.renderer;
    }

    if (options.root === undefined) {
      throw new Error("Please assign a root container object (the stage) as Smoothie's rootr option");
    } else {
      this.stage = options.root;
    }

    if (options.update === undefined) {
      throw new Error("Please assign a function that you want to update on each frame as Smoothie's update option");
    } else {
      this.update = options.update;
    }

    if (options.properties === undefined) {
      this.properties = { position: true, rotation: true };
    } else {
      this.properties = options.properties;
    }

    if (options.fps !== undefined) {
      this._fps = options.fps;
    } else {
      this._fps = undefined;
    }

    if (options.renderFps !== undefined) {
      this._renderFps = options.renderFps;
    } else {
      this._renderFps = undefined;
    }

    if (options.interpolate === false) {
      this.interpolate = false;
    } else {
      this.interpolate = true;
    }

    this.paused = false;

    this._startTime = Date.now();
    this._frameDuration = 1000 / this._fps;
    this._lag = 0;
    this._lagOffset = 0;

    this._renderStartTime = 0;
    if (this._renderFps !== undefined) {
      this._renderDuration = 1000 / this._renderFps;
    }
  }

  get fps() { return this._fps; }
  set fps(value) {
    this._fps = value;
    this._frameDuration = 1000 / this._fps;
  }

  get renderFps() { return this._renderFps; }
  set renderFps(value) {
    this._renderFps = value;
    this._renderDuration = 1000 / this._renderFps;
  }

  get dt() { return this._lagOffset; }

  pause() {
    this.paused = true;
  }
  resume() {
    this.paused = false;
  }

  start() {
    this.gameLoop();
  }

  gameLoop(timestamp) {
    requestAnimationFrame(this.gameLoop.bind(this));

    if (!this.paused) {
      const interpolate = () => {
        const current = Date.now();
        let elapsed = current - this._startTime;
        if (elapsed > 1000) elapsed = this._frameDuration;
        this._startTime = current;
        this._lag += elapsed;
        while (this._lag >= this._frameDuration) {
          this.capturePreviousSpriteProperties();
          this.update();
          this._lag -= this._frameDuration;
        }
        this._lagOffset = this._lag / this._frameDuration;
        this.render(this._lagOffset);
      };

      if (this._fps === undefined) {
        this.update();
        this.render();
      } else if (this._renderFps === undefined) {
        interpolate();
      } else if (timestamp >= this._renderStartTime) {
        interpolate();
        this._renderStartTime = timestamp + this._renderDuration;
      }
    }
  }

  capturePreviousSpriteProperties() {
    const setProperties = (sprite) => {
      if (this.properties.position) {
        sprite._previousX = sprite.x;
        sprite._previousY = sprite.y;
      }
      if (this.properties.rotation) {
        sprite._previousRotation = sprite.rotation;
      }
      if (this.properties.size) {
        sprite._previousWidth = sprite.width;
        sprite._previousHeight = sprite.height;
      }
      if (this.properties.scale) {
        sprite._previousScaleX = sprite.scale.x;
        sprite._previousScaleY = sprite.scale.y;
      }
      if (this.properties.alpha) {
        sprite._previousAlpha = sprite.alpha;
      }
      if (this.properties.tile) {
        if (sprite.tilePosition !== undefined) {
          sprite._previousTilePositionX = sprite.tilePosition.x;
          sprite._previousTilePositionY = sprite.tilePosition.y;
        }
        if (sprite.tileScale !== undefined) {
          sprite._previousTileScaleX = sprite.tileScale.x;
          sprite._previousTileScaleY = sprite.tileScale.y;
        }
      }

      if (sprite.children && sprite.children.length > 0) {
        for (let i = 0; i < sprite.children.length; i += 1) {
          const child = sprite.children[i];
          setProperties(child);
        }
      }
    };
    for (let i = 0; i < this.stage.children.length; i += 1) {
      const sprite = this.stage.children[i];
      setProperties(sprite);
    }
  }

  render(lagOffset = 1) {
    if (this.interpolate) {
      const interpolateSprite = (sprite) => {
        if (this.properties.position) {
          sprite._currentX = sprite.x;
          sprite._currentY = sprite.y;

          if (sprite._previousX !== undefined) {
            sprite.x = ((sprite.x - sprite._previousX) * lagOffset) + sprite._previousX;
          }
          if (sprite._previousY !== undefined) {
            sprite.y = ((sprite.y - sprite._previousY) * lagOffset) + sprite._previousY;
          }
        }
        if (this.properties.rotation) {
          sprite._currentRotation = sprite.rotation;
          if (sprite._previousRotation !== undefined) {
            sprite.rotation = ((sprite.rotation - sprite._previousRotation) * lagOffset)
              + sprite._previousRotation;
          }
        }
        if (this.properties.size) {
          if (sprite instanceof this.Sprite || sprite instanceof this.MovieClip) {
            sprite._currentWidth = sprite.width;
            sprite._currentHeight = sprite.height;
            if (sprite._previousWidth !== undefined) {
              sprite.width = ((sprite.width - sprite._previousWidth) * lagOffset)
                + sprite._previousWidth;
            }
            if (sprite._previousHeight !== undefined) {
              sprite.height = ((sprite.height - sprite._previousHeight) * lagOffset)
                + sprite._previousHeight;
            }
          }
        }
        if (this.properties.scale) {
          sprite._currentScaleX = sprite.scale.x;
          sprite._currentScaleY = sprite.scale.y;
          if (sprite._previousScaleX !== undefined) {
            sprite.scale.x = ((sprite.scale.x - sprite._previousScaleX) * lagOffset)
              + sprite._previousScaleX;
          }
          if (sprite._previousScaleY !== undefined) {
            sprite.scale.y = ((sprite.scale.y - sprite._previousScaleY) * lagOffset)
              + sprite._previousScaleY;
          }
        }
        if (this.properties.alpha) {
          sprite._currentAlpha = sprite.alpha;
          if (sprite._previousAlpha !== undefined) {
            sprite.alpha = ((sprite.alpha - sprite._previousAlpha) * lagOffset)
              + sprite._previousAlpha;
          }
        }

        if (this.properties.tile) {
          if (sprite.tilePosition !== undefined) {
            sprite._currentTilePositionX = sprite.tilePosition.x;
            sprite._currentTilePositionY = sprite.tilePosition.y;
            if (sprite._previousTilePositionX !== undefined) {
              sprite.tilePosition.x =
              ((sprite.tilePosition.x - sprite._previousTilePositionX) * lagOffset)
                + sprite._previousTilePositionX;
            }
            if (sprite._previousTilePositionY !== undefined) {
              sprite.tilePosition.y =
              ((sprite.tilePosition.y - sprite._previousTilePositionY) * lagOffset)
                + sprite._previousTilePositionY;
            }
          }
          if (sprite.tileScale !== undefined) {
            sprite._currentTileScaleX = sprite.tileScale.x;
            sprite._currentTileScaleY = sprite.tileScale.y;
            if (sprite._previousTileScaleX !== undefined) {
              sprite.tileScale.x = ((sprite.tileScale.x - sprite._previousTileScaleX) * lagOffset)
                + sprite._previousTileScaleX;
            }
            if (sprite._previousTileScaleY !== undefined) {
              sprite.tileScale.y = ((sprite.tileScale.y - sprite._previousTileScaleY) * lagOffset)
                + sprite._previousTileScaleY;
            }
          }
        }

        if (sprite.children.length !== 0) {
          for (let j = 0; j < sprite.children.length; j += 1) {
            const child = sprite.children[j];
            interpolateSprite(child);
          }
        }
      };

      for (let i = 0; i < this.stage.children.length; i += 1) {
        const sprite = this.stage.children[i];
        interpolateSprite(sprite);
      }
    }

    this.renderer.render(this.stage);

    if (this.interpolate) {
      const restoreSpriteProperties = (sprite) => {
        if (this.properties.position) {
          sprite.x = sprite._currentX;
          sprite.y = sprite._currentY;
        }
        if (this.properties.rotation) {
          sprite.rotation = sprite._currentRotation;
        }
        if (this.properties.size) {
          if (sprite instanceof this.Sprite || sprite instanceof this.MovieClip) {
            sprite.width = sprite._currentWidth;
            sprite.height = sprite._currentHeight;
          }
        }
        if (this.properties.scale) {
          sprite.scale.x = sprite._currentScaleX;
          sprite.scale.y = sprite._currentScaleY;
        }
        if (this.properties.alpha) {
          sprite.alpha = sprite._currentAlpha;
        }
        if (this.properties.tile) {
          if (sprite.tilePosition !== undefined) {
            sprite.tilePosition.x = sprite._currentTilePositionX;
            sprite.tilePosition.y = sprite._currentTilePositionY;
          }
          if (sprite.tileScale !== undefined) {
            sprite.tileScale.x = sprite._currentTileScaleX;
            sprite.tileScale.y = sprite._currentTileScaleY;
          }
        }

        if (sprite.children.length !== 0) {
          for (let i = 0; i < sprite.children.length; i += 1) {
            const child = sprite.children[i];
            restoreSpriteProperties(child);
          }
        }
      };
      for (let i = 0; i < this.stage.children.length; i += 1) {
        const sprite = this.stage.children[i];
        restoreSpriteProperties(sprite);
      }
    }
  }
}

export default Smooth;
