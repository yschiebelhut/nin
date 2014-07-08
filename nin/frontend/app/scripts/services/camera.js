'use strict';

angular.module('nin')
  .factory('camera', function (demo) {
    var controls;
    var cc;
    var layer;
    var clock = new THREE.Clock();

    var mouseclick = function(e) {
      var camera = layer.instance.camera;
      e.preventDefault();

      var elem = demo.renderer.domElement;
      var boundingRect = elem.getBoundingClientRect();
      var x = (e.clientX - boundingRect.left) * (elem.width / boundingRect.width);
      var y = (e.clientY - boundingRect.top) * (elem.height / boundingRect.height);
      var vector = new THREE.Vector3(
        (x / elem.width) * 2 - 1,
        - (y / elem.height) * 2 + 1,
        0.5
      );

      var projector = new THREE.Projector();
      projector.unprojectVector(vector, camera);

      var dir_vector = vector.sub(camera.position).normalize();
      var raycaster = new THREE.Raycaster(camera.position, dir_vector);

      var intersects = raycaster.intersectObjects(
        layer.instance.scene.children,
        true
      );

      if (intersects.length > 0) {
        var point = intersects[0].point;
        camera.lookAt(point);
      }
    };

    var updateCallback = function() {
      if (!cc.pause) return;

      var delta = clock.getDelta();
      controls.update(delta);
      requestAnimFrame(updateCallback);
    };

    var roundify = function(n, decimals) {
      var orders_of_magnitude = Math.pow(10, decimals); // POP! POP!
      return Math.round(n * orders_of_magnitude) / orders_of_magnitude;
    };

    return {
      getCameraPosition: function() {
        var camera = cc.camera;
        return [
          roundify(camera.position.x, 2),
          roundify(camera.position.y, 2),
          roundify(camera.position.z, 2)
        ];
      },
      getCameraLookat: function() {
        var camera = layer.instance.camera;
        var scene = layer.instance.scene;
        var vector = new THREE.Vector3(0, 0, 0.5);

        var projector = new THREE.Projector();
        projector.unprojectVector(vector, camera);
        var dir_vector = vector.sub(camera.position).normalize();
        var raycaster = new THREE.Raycaster(camera.position, dir_vector);
        var intersects = raycaster.intersectObjects(scene.children, true);

        var point;
        if (intersects.length > 0) {
          point = intersects[0].point;
        } else {
          var distance = - camera.position.z / dir_vector.z;
          point = camera.position.clone().add(dir_vector.multiplyScalar(distance));
        }
        return [
          roundify(point.x, 2),
          roundify(point.y, 2),
          roundify(point.z, 2)
        ];
      },
      toggleFlyAroundMode: function() {
        cc.pause = !cc.pause;
        if (cc.pause) {
          var camera = layer.instance.camera;
          controls = new THREE.FlyControls(camera, demo.renderer.domElement.parentElement);
          controls.movementSpeed = 400;
          controls.rollSpeed = Math.PI / 4;
          controls.autoForward = false;
          controls.dragToLook = true;
          requestAnimFrame(updateCallback);
          demo.renderer.domElement.parentElement.addEventListener("click", mouseclick);
        } else {
          cc.updateCamera(demo.looper.currentFrame - layer.startFrame);
          demo.renderer.domElement.parentElement.removeEventListener("click", mouseclick);
        }
      },
      resetFlyFlightDynamics: function resetFlyFlightDynamics() {
        if (cc) {
          cc.camera.rotation.x = 0;
          cc.camera.rotation.z = 0;
        }
      },
      startEdit: function(newLayer) {
        if (layer) {
          demo.renderer.domElement.parentElement.removeEventListener("click", mouseclick);
          cc.pause = false;
        }

        layer = newLayer;

        cc = CameraController.layers[layer.position];
      }
    };
  });
