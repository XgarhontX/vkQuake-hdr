#version 460
#extension GL_ARB_separate_shader_objects : enable
#extension GL_ARB_shading_language_420pack : enable
#extension GL_GOOGLE_include_directive : enable

layout (push_constant) uniform PushConsts
{
	mat4  mvp;
	vec3  fog_color;
	float fog_density;
}
push_constants;

layout (set = 0, binding = 0) uniform sampler2D tex;

layout (location = 0) in vec4 in_texcoord;
layout (location = 1) in vec4 in_color;
layout (location = 2) in float in_fog_frag_coord;

layout (location = 0) out vec4 out_frag_color;

#include "color_convert.inc"

void main ()
{
	out_frag_color = BT709GammaToBT2020Gamma (in_color) * BT709GammaToBT2020Gamma (texture (tex, in_texcoord.xy));
	if (push_constants.fog_density > 0.0f)
		out_frag_color.rgb = (out_frag_color.rgb * (1.0f - push_constants.fog_density)) + (BT709GammaToBT2020Gamma (push_constants.fog_color) * push_constants.fog_density);
	out_frag_color = max(out_frag_color, vec4(0.0));
	out_frag_color.w = min (out_frag_color.w, 1.0);
}
