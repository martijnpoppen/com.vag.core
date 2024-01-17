const Homey = require("homey");
const crypto = require("crypto");

const algorithm = "aes-256-ctr";
const secretKey = Homey.env.SECRET;
const secretKeyLegacy = Homey.env.SECRET_OLD;
const iv = crypto.randomBytes(16);

exports.sleep = async function (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

exports.getCurrentTimeStamp = function() {
    return Math.floor(Date.now() / 1000)
}

exports.encrypt = function (text, legacy = false) {
  const secret = legacy ? secretKeyLegacy : secretKey;
  const cipher = crypto.createCipheriv(algorithm, secret, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString("hex")}+${encrypted.toString("hex")}`;
};

exports.decrypt = function (hash, legacy = false) {
  if (hash === null) {
    return hash;
  }

  const secret = legacy ? secretKeyLegacy : secretKey;
  const splittedHash = hash.split("+");
  const decipher = crypto.createDecipheriv(
    algorithm,
    secret,
    Buffer.from(splittedHash[0], "hex")
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(splittedHash[1], "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
};

exports.keyMatch = function (o, r) {
  var c = 0;
  var no = {};

  Object.keys(o).forEach(function (k) {
    c++;
    no[k] = k.match(r) ? o[k] : void 0;
  });

  return ~c ? JSON.stringify(JSON.parse(no)) : null;
};

exports.calcCrow = function ($lat1, $lon1, $lat2, $lon2) {
  $R = 6371; // km
  $dLat = toRad($lat2 - $lat1);
  $dLon = toRad($lon2 - $lon1);
  $lat1 = toRad($lat1);
  $lat2 = toRad($lat2);

  $a =
    Math.sin($dLat / 2) * Math.sin($dLat / 2) +
    Math.sin($dLon / 2) *
      Math.sin($dLon / 2) *
      Math.cos($lat1) *
      Math.cos($lat2);
  $c = 2 * Math.atan2(Math.sqrt($a), Math.sqrt(1 - $a));
  $d = $R * $c;
  return $d;
};

// Converts numeric degrees to radians
function toRad($Value) {
  return ($Value * Math.PI) / 180;
}

exports.get = function(obj, dirtyPath, defaultValue) {
    if (obj === undefined || obj === null) return defaultValue;
    const path = typeof dirtyPath === 'string' ? dirtyPath.split('.') : dirtyPath;
    let objLink = obj;
    if (Array.isArray(path) && path.length) {
        for (let i = 0; i < path.length - 1; i++) {
            const currentVal = objLink[path[i]];
            if (currentVal !== undefined && currentVal !== null) {
                objLink = currentVal;
            } else {
                return defaultValue;
            }
        }
        const value = objLink[path[path.length - 1]];
        return value === undefined || value === null ? defaultValue : value;
    }
    return defaultValue;
}
