using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenFileConverter.SAL.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace OpenFileConverter.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConversionController : ControllerBase
    {
        private readonly ConversionService _conversionService;

        public ConversionController(ConversionService conversionService)
        {
            _conversionService = conversionService;
        }

        [HttpGet("available-conversions/{extension}")]
        public IActionResult GetAvailableConversions(string extension)
        {
            var conversions = GetConversionEndpoints();
            if (conversions.TryGetValue(extension, out var endpoints))
            {
                return Ok(new { Extension = extension, Endpoints = endpoints });
            }

            return NotFound("No available conversions for the specified extension.");
        }

        [HttpPost("mp3-to-mp4")]
        public async Task<IActionResult> ConvertMp3ToMp4(IFormFile inputFile)
        {
            return await ConvertFile(inputFile, ".mp4", _conversionService.ConvertMp3ToMp4);
        }

        [HttpPost("mp4-to-mp3")]
        public async Task<IActionResult> ConvertMp4ToMp3(IFormFile inputFile)
        {
            return await ConvertFile(inputFile, ".mp3", _conversionService.ConvertMp4ToMp3);
        }

        private async Task<IActionResult> ConvertFile(IFormFile inputFile, string outputExtension,
            Func<string, string, Task<string>> conversionFunction)
        {
            if (inputFile == null || inputFile.Length == 0)
                return BadRequest("No file uploaded.");

            var inputFilePath = Path.GetTempFileName();
            var outputFilePath = Path.ChangeExtension(inputFilePath, outputExtension);

            using (var stream = new FileStream(inputFilePath, FileMode.Create))
            {
                await inputFile.CopyToAsync(stream);
            }

            var result = await conversionFunction(inputFilePath, outputFilePath);

            var fileBytes = await System.IO.File.ReadAllBytesAsync(result);
            var fileName = Path.GetFileName(result);
            return File(fileBytes, "application/octet-stream", fileName);
        }

        private Dictionary<string, List<string>> GetConversionEndpoints()
        {
            var conversions = new Dictionary<string, List<string>>();
            var methods = typeof(ConversionController).GetMethods(BindingFlags.Public | BindingFlags.Instance)
                .Where(m => m.GetCustomAttributes(typeof(HttpPostAttribute), false).Any());

            foreach (var method in methods)
            {
                var attribute = method.GetCustomAttribute<HttpPostAttribute>();
                if (attribute != null && attribute.Template != null)
                {
                    var endpoint = attribute.Template;
                    var methodNameParts = method.Name.Replace("Convert", "").Split("To");
                    if (methodNameParts.Length == 2)
                    {
                        var inputExtension = $".{methodNameParts[0].ToLower()}";

                        if (!conversions.ContainsKey(inputExtension))
                        {
                            conversions[inputExtension] = new List<string>();
                        }

                        conversions[inputExtension].Add($"api/conversion/{endpoint}");
                    }
                }
            }

            return conversions;
        }
    }
}