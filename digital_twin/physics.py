import math

# Specific gas constant for dry air in J / (kg * K)
R_SPECIFIC_DRY_AIR = 287.058

# Temperature offset for Kelvin conversion
KELVIN_OFFSET = 273.15


def calculate_air_density(pressure_hpa: float, temperature_c: float) -> float:
    """
    Calculates air density (rho) in kg/m^3 using the Ideal Gas Law:
    rho = P / (R * T)

    :param pressure_hpa: Absolute pressure in hectopascals (hPa)
    :param temperature_c: Temperature in degrees Celsius (°C)
    :return: Air density in kg/m^3
    """
    if pressure_hpa < 0:
        raise ValueError("Pressure cannot be negative")

    # Convert pressure from hPa to Pascals (Pa)
    pressure_pa = pressure_hpa * 100.0

    # Convert temperature from Celsius to Kelvin (K)
    temperature_k = temperature_c + KELVIN_OFFSET
    if temperature_k <= 0:
        raise ValueError("Absolute temperature must be greater than zero Kelvin")

    # rho = P / (R * T)
    rho = pressure_pa / (R_SPECIFIC_DRY_AIR * temperature_k)
    return rho


def calculate_angular_velocity(rpm: float) -> float:
    """
    Converts engine speed (RPM) to angular velocity (omega) in rad/s:
    omega = 2 * pi * RPM / 60

    :param rpm: Crankshaft rotation speed in RPM
    :return: Angular velocity in rad/s
    """
    if rpm < 0:
        raise ValueError("RPM cannot be negative")
    return (2.0 * math.pi * rpm) / 60.0


def calculate_torque_from_power(power_watts: float, rpm: float) -> float:
    """
    Calculates torque in Newton-meters (N·m) from power and engine speed:
    Torque = Power / omega

    :param power_watts: Engine power output in Watts
    :param rpm: Engine speed in RPM
    :return: Crankshaft torque in N·m
    """
    if rpm <= 0:
        return 0.0
    omega = calculate_angular_velocity(rpm)
    return power_watts / omega


def calculate_power_from_torque(torque_nm: float, rpm: float) -> float:
    """
    Calculates engine power output in Watts (W) from torque and engine speed:
    Power = Torque * omega

    :param torque_nm: Engine torque output in N·m
    :param rpm: Engine speed in RPM
    :return: Engine power in Watts
    """
    if rpm < 0 or torque_nm < 0:
        return 0.0
    omega = calculate_angular_velocity(rpm)
    return torque_nm * omega
