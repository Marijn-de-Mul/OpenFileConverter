using Microsoft.AspNetCore.Mvc;

namespace OpenFileConverter.Controllers;

public class UserController : Controller
{
    // GET
    public IActionResult Index()
    {
        return View();
    }
}