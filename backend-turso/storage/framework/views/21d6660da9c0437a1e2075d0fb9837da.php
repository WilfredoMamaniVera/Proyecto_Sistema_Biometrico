<!DOCTYPE html>
<html>
<head>
    <title>Registro de Vacaciones</title>
</head>
<body>
    <h1>Registro de Vacaciones</h1>
    <table border="1">
        <thead>
            <tr>
                <th>Usuario</th>
                <th>Información</th>
            </tr>
        </thead>
        <tbody>
            <?php $__currentLoopData = $usuarios; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $usuario): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <tr>
                    <td><?php echo e($usuario->nombre_usuario); ?></td>
                    <td>Vacaciones no especificadas (ajusta según tu lógica)</td>
                </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </tbody>
    </table>
</body>
</html><?php /**PATH C:\laragon\www\Proyecto_Sistema_Biometrico\Proyecto_Sistema_Biometrico\backend-turso\resources\views/reportes/vacaciones.blade.php ENDPATH**/ ?>