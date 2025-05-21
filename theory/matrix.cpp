attribute highp vec4 posAttr;
attribute lowp vec4 colAttr;
varying lowp vec4 col;

// 🔧 Uniformy pro jednotlivé transformace
uniform highp vec3 translation; // posun v XYZ
uniform highp vec3 rotation;    // rotace v radiánech kolem os X, Y, Z
uniform highp vec3 scale;       // měřítko v osách XYZ

void main() {
    col = colAttr;

    // 🔁 1. Rotace kolem osy X
    mat4 rotX = mat4(
        1.0,          0.0,           0.0, 0.0,
        0.0,  cos(rotation.x), -sin(rotation.x), 0.0,
        0.0,  sin(rotation.x),  cos(rotation.x), 0.0,
        0.0,          0.0,           0.0, 1.0
    );

    // 🔁 2. Rotace kolem osy Y
    mat4 rotY = mat4(
         cos(rotation.y), 0.0, sin(rotation.y), 0.0,
                 0.0,     1.0,          0.0,     0.0,
        -sin(rotation.y), 0.0, cos(rotation.y), 0.0,
                 0.0,     0.0,          0.0,     1.0
    );

    // 🔁 3. Rotace kolem osy Z
    mat4 rotZ = mat4(
        cos(rotation.z), -sin(rotation.z), 0.0, 0.0,
        sin(rotation.z),  cos(rotation.z), 0.0, 0.0,
               0.0,              0.0,      1.0, 0.0,
               0.0,              0.0,      0.0, 1.0
    );

    // 📦 4. Skalování
    mat4 scaleMatrix = mat4(
        scale.x, 0.0,     0.0,     0.0,
        0.0,     scale.y, 0.0,     0.0,
        0.0,     0.0,     scale.z, 0.0,
        0.0,     0.0,     0.0,     1.0
    );

    // 💠 5. Translace
    mat4 translationMatrix = mat4(
        1.0, 0.0, 0.0, translation.x,
        0.0, 1.0, 0.0, translation.y,
        0.0, 0.0, 1.0, translation.z,
        0.0, 0.0, 0.0, 1.0
    );

    // 🔗 6. Složení transformace: T * Rz * Ry * Rx * S
    mat4 transform = translationMatrix * rotZ * rotY * rotX * scaleMatrix;

    // 📍 Výsledná pozice
    gl_Position = transform * posAttr;
}
